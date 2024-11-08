const Sequelize = require("sequelize"); // import sequelize
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const User = require("./user");
const Wardrobe = require("./wardrobe");

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config
)

db.sequelize = sequelize;
db.User = User;
db.Wardrobe = Wardrobe;


User.init(sequelize);
Wardrobe.init(sequelize);

User.associate(db);
Wardrobe.associate(db);

module.exports = db;