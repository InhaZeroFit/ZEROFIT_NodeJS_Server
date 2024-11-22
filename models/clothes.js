const Sequelize = require("sequelize");

class Clothes extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            clothes_id : {
                type : Sequelize.INTEGER,
                allowNull : false,
                unique : true,
                primaryKey : true,
                autoIncrement : true,
            },
            name : {
                type : Sequelize.STRING(30),
                allowNull : false,
                defaultValue : "NoName",
            },
            clothes_type : {
                type : Sequelize.DataTypes.ENUM("Top", "Bottom", "Coat", "Dress", "Accessory"),
                allowNull : false,
                defaultValue : "OtherType",
            },
            score : {
                type : Sequelize.ENUM("1", "2", "3", "4", "5"),
                allowNull : false,
                defaultValue : "NoScore",
            },
            size : {
                type : Sequelize.DataTypes.ENUM("90", "95", "100", "105", "110", "Other"),
                allowNull : false,
                defaultValue : "OtherSize",
            },
            brand : {
                type : Sequelize.DataTypes.ENUM("Casual", "Vintage", "Formal", "Minimal"),
                allowNull : false,
                defaultValue : "OtherBrand",
            },
            memo : {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            color : {
                type : Sequelize.STRING(10),
                allowNull : true,
            },
            date_purchase : {
                type : Sequelize.STRING(10),
                allowNull : true,
            }
        }, {
            sequelize,
            timestamps : true,
            underscored : true,
            modelName : "Clothes",
            tableName : "clothes",
            paranoid : true,
            charset : "utf8",
            collate : "utf8_general_ci",
        })
    };
    static associate(db) {
        db.Clothes.belongsTo(db.User, {
            foreignKey : "user_id",
            targetKey : "user_id",
        });
        db.Clothes.belongsTo(db.Wardrobe, {
            foreignKey : "wardrobe_id",
            targetKey : "wardrobe_id",
        });
        db.Clothes.hasMany(db.Photo, {
            foreignKey : "clothes_id",
            sourceKey : "clothes_id",
        });
        db.Clothes.hasMany(db.Market, {
            foreignKey : "clothes_id",
            sourceKey : "clothes_id",
        });
    };
}

module.exports = Clothes;