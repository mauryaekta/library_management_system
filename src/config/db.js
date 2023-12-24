const { DataTypes, Sequelize } = require('sequelize')
const config = require('./config')
var db = {};


// create database connection 
const sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PASSWORD,
    {
        host: config.DB_HOST,
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('../models/users')(sequelize, DataTypes)
db.books = require('../models/books')(sequelize, DataTypes)
db.loan = require('../models/loan')(sequelize, DataTypes)

// create table in DataBase
db.sequelize.sync({ alter: true }).then(() => {
    console.log('table has been created successfully.');
}).catch((error) => {
    console.error('Unable to table in Database: ', error);
})


db.books.hasMany(db.loan, {
    foreignKey: "book_id"
});
db.loan.belongsTo(db.books, {
    foreignKey: "book_id"
});
db.users.hasMany(db.loan, {
    foreignKey: "user_id"
});
db.loan.belongsTo(db.users, {
    foreignKey: "user_id"
});


module.exports = { sequelize, db }