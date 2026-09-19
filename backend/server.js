const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test principale pour Render
app.get('/', (req, res) => {
    res.send('API HelloConnect opérationnelle !');
});
// Route pour l'inscription
app.post('/register', (req, res) => {
    // 1. On récupère les données envoyées par React
    // React envoie 'password', mais on gère aussi les autres variantes par sécurité
    const { nom, email, password, motdepasse, mot_de_passe } = req.body;
    const userPassword = password || motdepasse || mot_de_passe;

    // 2. Requête SQL
    // Si la colonne dans ta table Aiven s'appelle 'mot_de_passe' :
    const sql = "INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)";

    // Note : Si dans MySQL ta colonne s'appelle 'password', remplace la ligne ci-dessus par :
    // const sql = "INSERT INTO utilisateurs (nom, email, password) VALUES (?, ?, ?)";

    db.query(sql, [nom, email, userPassword], (err, result) => {
        if (err) {
            console.error("Erreur SQL lors de l'insertion :", err);
            return res.status(500).json({ error: "Erreur lors de l'inscription" });
        }

        res.status(200).json({
            message: "Utilisateur inscrit avec succès !",
            user: { nom, email }
        });
    });
});

// Route pour la connexion
app.post('/login', (req, res) => {
    const { email, password, motdepasse } = req.body;
    const userPassword = password || motdepasse;

    // 1. On cherche si l'utilisateur existe avec cet e-mail
    const sql = "SELECT * FROM utilisateurs WHERE email = ?";

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Erreur SQL lors de la connexion :", err);
            return res.status(500).json({ error: "Erreur serveur lors de la connexion" });
        }

        // Si aucun utilisateur n'est trouvé
        if (results.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        const user = results[0];

        // 2. On vérifie le mot de passe (colonne 'mot_de_passe' ou 'password')
        const storedPassword = user.mot_de_passe || user.password;

        if (storedPassword !== userPassword) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
        }

        // 3. Connexion réussie !
        res.status(200).json({
            message: "Connexion réussie !",
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email
            }
        });
    });
});
// Connexion MySQL Aiven via variables d'environnement
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 18408,
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'defaultdb',
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion MySQL :', err);
        return;
    }
    console.log('✅ Connecté avec succès à la base MySQL Aiven !');

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      mot_de_passe VARCHAR(255) NOT NULL
    );
  `;

    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('❌ Erreur lors de la création de la table :', err);
        } else {
            console.log('✅ Table "utilisateurs" vérifiée/créée avec succès !');
        }
    });
});

// DÉMARRAGE IMMÉDIAT DU SERVEUR (Indépendant de la DB)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré et à l'écoute sur le port ${PORT}`);
});