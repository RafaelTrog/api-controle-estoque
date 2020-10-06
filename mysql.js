const mysql = require('mysql2');

const pool = mysql.createPool({
    "user": "root",
    "password": "wiki",
    "database": "general_db",
    "host": "localhost",
    "port": 3306
});

exports.pool = pool;