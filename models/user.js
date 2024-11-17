const Sequelize = require("sequelize");

class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            user_id : {
                type : Sequelize.INTEGER,
                allowNull : false,
                unique : true,
                primaryKey : true,
                autoIncrement : true,
            },
            email : {
                type : Sequelize.STRING(40),
                allowNull : false, 
                unique : true,
                validate : {
                    isEmail : true,
                },
            },
            password : {
                type : Sequelize.STRING(255),
                allowNull : false,
            },
            phone_number : {
                type : Sequelize.STRING(20),
                allowNull : false,
            },
            name : {
                type : Sequelize.STRING(20),
                allowNull : false,
            },
            gender : {
                type : Sequelize.DataTypes.ENUM("Male", "Female", "Other"),
                allowNull : true,
                defaultValue : "Other",
            },
            nick : {
                type : Sequelize.STRING(20),
                allowNull : true,
                defaultValue : "noname",
            },
            profile_photo : {
                type : Sequelize.STRING(100),
                allowNull : true,
                defaultValue : "/public/default_image.png",
            },
            address : {
                type : Sequelize.STRING(40),
                allowNull : true,
            },
            payment : {
                type : Sequelize.STRING(20),
                allowNull : true,
            },
            login_at : {
                type : Sequelize.DATE,
                allowNull : true, // NULL means the user didn't login.
                defaultValue : Sequelize.DataTypes.NOW,
            }
        }, {
            sequelize,
            timestamps : true, // create automatically createdAt, updatedAt
            underscored : true, // set snake_case
            modelName : "User",
            tableName : "users",
            paranoid : true, // true is soft delete.
            charset : "utf8",
            collate : "utf8_general_ci", // utf8_general_ci : option of Korean
        })
    };
    static associate(db) {
        db.User.hasMany(db.Wardrobe, {
            foreignKey : "user_id",   // FK of wardrobes table
            sourceKey : "user_id",     // PK of users table
        });
        db.User.hasMany(db.Clothes, {
            foreignKey : "user_id",
            sourceKey : "user_id",
        });
        db.User.hasMany(db.Market, {
            foreignKey : "user_id",
            sourceKey : "user_id",
        });
    };
}

module.exports = User;