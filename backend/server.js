const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connexion au pool MySQL Aiven
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Route d'accueil
app.get('/', (req, res) => {
    res.send('API HelloConnect opérationnelle !');
});

// Route de test pour consulter les utilisateurs enregistrés
//app.get('/test-users', (req, res) => {
//  db.query("SELECT id, nom, email, mot_de_passe FROM utilisateurs", (err, results) => {
//     if (err) {
//         return res.status(500).json({ error: "Impossible de lire la base de données" });
//     }
//     res.json(results);
//  });
//});

// Route d'inscription sécurisée (POST /register)
app.post('/register', async (req, res) => {
    const { nom, email, mot_de_passe } = req.body;

    if (!nom || !email || !mot_de_passe) {
        return res.status(400).json({ error: "Veuillez remplir tous les champs." });
    }

    try {
        // Hachage du mot de passe (10 tours de salt)
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        const sql = "INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)";
        db.query(sql, [nom, email, hashedPassword], (err, result) => {
            if (err) {
                console.error("Erreur SQL lors de l'inscription :", err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "Cet e-mail est déjà utilisé." });
                }
                return res.status(500).json({ error: "Erreur lors de l'inscription." });
            }
            res.status(201).json({ message: "Utilisateur inscrit avec succès !" });
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors du chiffrement du mot de passe." });
    }
});

// Route de connexion sécurisée (POST /login)
app.post('/login', (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ error: "Veuillez fournir un e-mail et un mot de passe." });
    }

    const sql = "SELECT * FROM utilisateurs WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la connexion." });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Identifiants incorrects." });
        }

        const user = results[0];

        // Comparaison du mot de passe saisi avec le hash stocké en BDD
        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

        if (!isMatch) {
            return res.status(401).json({ error: "Identifiants incorrects." });
        }

        // Connexion réussie
        res.status(200).json({
            message: "Connexion réussie !",
            user: { id: user.id, nom: user.nom, email: user.email }
        });
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});