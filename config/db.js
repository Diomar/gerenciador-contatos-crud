require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Função para verificar a conexão com o banco de dados
(async () => {
    try {
        console.log('Tentando conectar ao banco de dados...');
        const [rows] = await pool.query('SELECT 1');
        console.log('Conexão com o banco de dados bem-sucedida!');
    } catch (error) {
        console.error('Erro na conexão com o banco de dados:', error);
    }
})();

// Exporta o objeto do tipo Pool
module.exports = pool;
