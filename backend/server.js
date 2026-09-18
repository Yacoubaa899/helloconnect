const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Utilisateur par défaut de XAMPP
    password: '',      // Mot de passe vide par défaut sur XAMPP
    database: 'helloconnect_db'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à MySQL :', err.message);
    } else {
        console.log('Connecté avec succès à la base de données MySQL !');
    }
});

// 2. Route pour l'INSCRIPTION (Enregistrer un utilisateur)
app.post('/api/register', (req, res) => {
    const { nom, email, password } = req.body;

    const sql = "INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)";
    db.query(sql, [nom, email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Cet email est déjà utilisé !" });
            }
            return res.status(500).json({ error: "Erreur lors de l'inscription." });
        }
        res.json({ message: "Compte créé avec succès !", user: { nom, email } });
    });
});

// 3. Route pour la CONNEXION (Vérifier un utilisateur)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM utilisateurs WHERE email = ? AND mot_de_passe = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur." });

        if (results.length > 0) {
            const user = results[0];
            res.json({ message: "Connexion réussie !", user: { nom: user.nom, email: user.email } });
        } else {
            res.status(401).json({ error: "Email ou mot de passe incorrect." });
        }
    });
});

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur Node.js démarré sur http://localhost:${PORT}`);
});