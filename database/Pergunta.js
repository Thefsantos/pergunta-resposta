const Sequelize = require("sequelize");
const connection = require("./database");

const Perguntar = connection.define('pergunta',{
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Perguntar.sync({force: false}).then(() => {});

module.exports = Perguntar;