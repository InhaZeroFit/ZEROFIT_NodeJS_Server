const Sequelize = require("sequelize"); // import sequelize
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config")[env];
const User = require("./user");
const Wardrobe = require("./wardrobe");
const Clothes = require("./clothes");
const Photo = require("./photo");
const Market = require("./market");

const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        port: config.port,
        pool: config.pool,
        logging: config.logging,
        dialectOptions: config.dialectOptions,
    }
);
    
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });


db.sequelize = sequelize;
db.User = User;
db.Wardrobe = Wardrobe;
db.Clothes = Clothes;
db.Photo = Photo;
db.Market = Market;

User.init(sequelize);
Wardrobe.init(sequelize);
Clothes.init(sequelize);
Photo.init(sequelize);
Market.init(sequelize);

User.associate(db);
Wardrobe.associate(db);
Clothes.associate(db);
Photo.associate(db);
Market.associate(db);

module.exports = db;