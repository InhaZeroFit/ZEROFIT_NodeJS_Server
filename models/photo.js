const Sequelize = require("sequelize");

class Photo extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            photo_id : {
                type : Sequelize.INTEGER,
                allowNull : false,
                unique : true,
                primaryKey : true,
                autoIncrement : true
            },
            photo_url : {
                type : Sequelize.STRING(40),
                allowNull : false,
            },
        }, {
            sequelize,
            timestamps : true,
            underscored : true,
            modelName : "Photo",
            tableName : "photos",
            paranoid : true,
            charset : "utf8",
            collate : "utf8_general_ci",
        })
    };
    static associate(db) {
        db.Photo.belongsTo(db.Clothes, {
            foreignKey : "clothes_id",
            targetKey : "clothes_id",
        });
    };
}

module.exports = Photo;