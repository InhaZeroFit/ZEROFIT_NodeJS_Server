const Sequelize = require("sequelize");

class Wardrobe extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            wardrobe_id : {
                type : Sequelize.INTEGER,
                allowNull : false,
                unique : true,
                primaryKey : true,
                autoIncrement : true,
            },
            wardrobe_name : {
                type : Sequelize.STRING(20),
                allowNull : false,
                defaultValue : "My wardrobe",
            },
        }, {
            sequelize,
            timestamps : true,
            underscored : true,
            modelName : "Wardrobe",
            tableName : "wardrobe",
            paranoid : true,
            charset : "utf8",
            collate : "utf8_general_ci",
        })
    };
    static associate(db) {
        db.Wardrobe.belongsTo(db.User, {
            foreignKey : "user_id",  // FK of wardrobes table
            targetKey : "user_id",    // PK of users table
        });
        db.Wardrobe.hasMany(db.Clothes, {
            foreignKey : "wardrobe_id",
            sourceKey : "wardrobe_id",
        });
    };
}

module.exports = Wardrobe;