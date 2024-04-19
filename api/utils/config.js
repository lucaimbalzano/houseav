require('dotenv').config(); // Load environment variables from .env file

const config = {
    db: {
      host: process.env.MYSQL_SERVER,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      connectTimeout: 60000
    },
    listPerPage: 10,
};

module.exports = config;