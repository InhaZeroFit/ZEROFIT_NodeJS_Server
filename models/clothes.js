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
            score : {
                type : Sequelize.ENUM("1", "2", "3", "4", "5"),
                allowNull : false,
            },
            clothes_type: {
                type: Sequelize.TEXT, // JSON 데이터를 저장하기 위해 TEXT로 변경
                allowNull: false,
                get() {
                    const rawValue = this.getDataValue("clothes_type");
                    return rawValue ? JSON.parse(rawValue) : [];
                },
                set(value) {
                    this.setDataValue("clothes_type", JSON.stringify(value));
                },
            },
            clothes_style: {
                type: Sequelize.TEXT, // JSON 데이터를 저장하기 위해 TEXT로 변경
                allowNull: false,
                get() {
                    const rawValue = this.getDataValue("clothes_style");
                    return rawValue ? JSON.parse(rawValue) : [];
                },
                set(value) {
                    this.setDataValue("clothes_style", JSON.stringify(value));
                },
            },
            memo : {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            include_point: { // 새롭게 추가된 컬럼
                type: Sequelize.TEXT,
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue("include_point");
                    return rawValue ? JSON.parse(rawValue) : null;
                },
                set(value) {
                    this.setDataValue("include_point", JSON.stringify(value));
                },
            },
            exclude_point: { // 새롭게 추가된 컬럼
                type: Sequelize.TEXT,
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue("exclude_point");
                    return rawValue ? JSON.parse(rawValue) : null;
                },
                set(value) {
                    this.setDataValue("exclude_point", JSON.stringify(value));
                },
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