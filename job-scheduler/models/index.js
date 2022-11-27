const dbConfig = require('../db.config.js');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    port:dbConfig.PORT,
    dialectOptions: {
      encrypt: true,
      ssl : {
        rejectUnauthorized: false
      }
    },
});



const db = {};
db.sequelize = sequelize;



db.models = {};
db.models.Job = require('./job')(sequelize, Sequelize.DataTypes);


module.exports = db;
