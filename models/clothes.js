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
            image_url : {
                type : Sequelize.STRING(100),
                allowNull : false,
            },
            name : {
                type : Sequelize.STRING(30),
                allowNull : false,
            },
            clothes_type : {
                type : Sequelize.DataTypes.ENUM("상의", "하의", "외투", "원피스", "액세서리"),
                allowNull : false,
            },
            score : {
                type : Sequelize.ENUM("1", "2", "3", "4", "5"),
                allowNull : false,
            },
            style : {
                type : Sequelize.DataTypes.ENUM("캐주얼", "빈티지", "포멀", "미니멀"),
                allowNull : false,
            },
            memo : {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            size : {
                type : Sequelize.DataTypes.ENUM("90", "95", "100", "105", "110", "Other"),
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
        db.Clothes.hasMany(db.Market, {
            foreignKey : "clothes_id",
            sourceKey : "clothes_id",
        });
    };
}

module.exports = Clothes;