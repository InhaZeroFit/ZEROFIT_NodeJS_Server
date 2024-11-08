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
        }, {
            sequelize,
            timestamps : true,
            underscored : true,
            modelName : "Wardrobe",
            tableName : "wardrobe",
            paranoid : false, // soft delete option
            charset : "utf8",
            collate : "utf8_general_ci",
        })
    }
    static associate(db) {
        db.Wardrobe.belongsTo(db.User, {
            foreignKey: "user_id",  // FK of wardrobes table
            targetKey: "user_id"    // PK of users table
        });
    }
}

module.exports = Wardrobe;