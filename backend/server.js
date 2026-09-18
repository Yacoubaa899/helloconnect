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