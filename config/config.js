const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development : {
    username : process.env.SEQUELIZE_DEV_USERNAME,
    password : process.env.SEQUELIZE_DEV_PASSWORD,
    database : process.env.SEQUELIZE_DEV_DB,
    host : process.env.SEQUELIZE_DEV_HOST,
    dialect : 'mysql',
    port : process.env.SEQUELIZE_DEV_PORT,
  },
  test : {
    username : process.env.SEQUELIZE_USERNAME,
    password : process.env.SEQUELIZE_PASSWORD,
    database : process.env.SEQUELIZE_DB_TEST,
    host : process.env.SEQUELIZE_HOST,
    dialect : 'mysql',
    port : process.env.SEQUELIZE_PORT,
  },
  production : {
    username : process.env.SEQUELIZE_USERNAME,
    password : process.env.SEQUELIZE_PASSWORD,
    database : process.env.SEQUELIZE_DB_PROD,
    host : process.env.SEQUELIZE_HOST,
    dialect : 'mysql',
    logging : false,  // ide SQL query statements.
    port : process.env.SEQUELIZE_PORT,
    dialectOptions : {
      connectTimeout : 6000,  // MySQL2에서 연결 시간 초과 설정
    },
  },
};