const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            user_id : {
                type : Sequelize.INTEGER,
                allowNull : false,
                unique : true,
                primaryKey : true,
                autoIncrement : true,
            },
            password : {
                type : Sequelize.STRING(40),
                allowNull : false,
            },
            email : {
                type : Sequelize.STRING(40),
                allowNull : false, 
                unique : true,
                validate : {
                    isEmail : true,
                }
            },
            name : {
                type : Sequelize.STRING(15),
                allowNull : false,
            },
            nick : {
                type : Sequelize.STRING(10),
                allowNull : true,
                defaultValue : "unnamed",
            },
        }, {
            sequelize,
            timestamps : true, //create automatically createdAt, updatedAt
            underscored : true, // set snake_case
            modelName : "User",
            tableName : "users",
            paranoid : true,
            charset : "utf8",
            collate : "utf8_general_ci",
        })
    }
    static associate(db) {
        db.User.hasMany(db.Wardrobe, {
            foreignKey: "user_id",   // Wardrobe 테이블의 외래 키
            sourceKey: "user_id"     // User 테이블의 기본 키
        });
    }
}