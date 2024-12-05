const Sequelize = require('sequelize');  // import sequelize
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const User = require('./user');
const Clothes = require('./clothes');
const Market = require('./market');
const Wishlist = require('./wishlist');

const db = {};

const sequelize =
    new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      port: config.port,
      pool: config.pool,
      logging: config.logging,
      dialectOptions: config.dialectOptions,
    });

sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((error) => {
      console.error('Unable to connect to the database: ', error);
    });


db.sequelize = sequelize;
db.User = User;
db.Clothes = Clothes;
db.Market = Market;
db.Wishlist = Wishlist;

User.init(sequelize);
Clothes.init(sequelize);
Market.init(sequelize);
Wishlist.init(sequelize);

User.associate(db);
Clothes.associate(db);
Market.associate(db);
Wishlist.associate(db);

module.exports = db;