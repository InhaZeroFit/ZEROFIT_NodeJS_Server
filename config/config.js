const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    development : {
        username : process.env.SEQUELIZE_USERNAME,
        password : process.env.SEQUELIZE_PASSWORD,
        database : process.env.SEQUELIZE_DB_DEV,
        host : process.env.SEQUELIZE_HOST,
        dialect : "mysql"
    },
    test : {
        username : process.env.SEQUELIZE_USERNAME,
        password : process.env.SEQUELIZE_PASSWORD,
        database : process.env.SEQUELIZE_DB_TEST,
        host : process.env.SEQUELIZE_HOST,
        dialect : "mysql"
    },
    production : {
        username : process.env.SEQUELIZE_USERNAME,
        password : process.env.SEQUELIZE_PASSWORD,
        database : process.env.SEQUELIZE_DB_PROD,
        host : process.env.SEQUELIZE_HOST,
        dialect : "mysql",
        logging : false, // ide SQL query statements.
    },
};