const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
        {
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING(50),
            allowNull: true,
          },
          email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true,
            },
          },
          password: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          address: {
            type: Sequelize.STRING(40),
            allowNull: false,
          },
          phone_number: {
            type: Sequelize.STRING(20),
            allowNull: true,
          },
          gender: {
            type: Sequelize.DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: true,
            defaultValue: 'Other',
          },
          nick: {
            type: Sequelize.STRING(20),
            allowNull: true,
            defaultValue: 'noname',
          },
          person_image: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 'default_image',
          },
          profile_image: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 'default_image',
          },
          payment: {
            type: Sequelize.STRING(20),
            allowNull: true,
          },
          login_at: {
            type: Sequelize.DATE,
            allowNull: true,  // NULL means the user didn't login.
            defaultValue: Sequelize.DataTypes.NOW,
          }
        },
        {
          sequelize,
          timestamps: true,   // create automatically createdAt, updatedAt
          underscored: true,  // set snake_case
          modelName: 'User',
          tableName: 'users',
          paranoid: true,  // true is soft delete.
          charset: 'utf8',
          collate: 'utf8_general_ci',  // utf8_general_ci : option of Korean
          hooks: {
            // Before saving, check if name is null, and set it to email's
            // prefix
            beforeCreate: (user, options) => {
              if (!user.name) {  // name이 null이거나 빈 값인 경우
                const emailPrefix =
                    user.email.split('@')[0];  // email의 '@' 앞부분
                user.name = emailPrefix;
              }
            },
          }
        })
  };
  static associate(db) {
    db.User.hasMany(db.Clothes, {
      foreignKey: 'user_id',
      sourceKey: 'user_id',
    });
    db.User.hasMany(db.Market, {
      foreignKey: 'user_id',
      sourceKey: 'user_id',
    });
  };
}

module.exports = User;