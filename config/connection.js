const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'employee_db'
    }
  );

module.exports = connection;