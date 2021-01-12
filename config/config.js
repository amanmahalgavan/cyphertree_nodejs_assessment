require('dotenv').config();

const dbSettings = () => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case 'development':
      return {
        salt_rounds: 10,
        server_port: process.env.DEV_SERVER_PORT,
        auth_secret_key: process.env.DEV_AUTH_SECRET,
        username: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASS,
        database: process.env.DEV_DB,
        host: process.env.DEV_DB_HOST,
        dialect: process.env.DEV_DIALECT
      }
    default:
      break;
  }
}

module.exports = dbSettings();
