require('dotenv').config();

module.exports = {
  server: process.env.DB_SERVER || "localhost",
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    encrypt: false,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};