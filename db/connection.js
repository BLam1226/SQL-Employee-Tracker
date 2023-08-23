// Initialize MySQL database connection
const mysql = require("mysql2/promise");

// Connect to database
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootr00t!",
  database: "employees_db",
});

module.exports = connection;
