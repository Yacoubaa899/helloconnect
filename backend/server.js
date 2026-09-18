const mysql = require('mysql2');

// 1. Configuration de la connexion à Aiven
const db = mysql.createConnection({
    host: 'mysql-30d4c716-yac02346010-7fbd.j.aivencloud.com', // ⚠️ Colle ton Host Aiven ici
    port: 18408,                         // Ton port Aiven
    user: 'avnadmin',                    // Ton utilisateur Aiven
    password: 'AVNS_p0pNnZz8PFg_BxV75aV',        // ⚠️ Colle ton mot de passe Aiven ici
    database: 'defaultdb',               // Le nom par défaut sur Aiven
    ssl: {
        rejectUnauthorized: false          // Obligatoire pour se connecter à Aiven
    }
});

// 2. Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion à MySQL Aiven :', err);
        return;
    }
    console.log('✅ Connecté avec succès à MySQL Aiven !');

    // 3. Création automatique de la table "utilisateurs" si elle n'existe pas
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      mot_de_passe VARCHAR(255) NOT NULL
    );
  `;

    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('❌ Erreur lors de la création de la table :', err);
        } else {
            console.log('✅ Table "utilisateurs" vérifiée/créée avec succès dans le Cloud !');
        }
    });
});

module.exports = db;