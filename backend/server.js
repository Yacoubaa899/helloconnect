const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql-30d4c716-yac02346010-7fbd.j.aivencloud.com',
    port: process.env.DB_PORT || 18408,
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD || 'AVNS_p0pNnZz8PFg_BxV75aV',
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
});

module.exports = db;