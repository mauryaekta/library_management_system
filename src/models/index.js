const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const basename = path.basename(__filename)
const config = require('../config/config')
const db = {}

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
    console.log('Connection has been established successfully.')
}).catch(error => {
    console.log('Unable to connect Database', error)
})
fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
}).forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes)
    db[model.name] = model
})
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('../models/users')(sequelize, DataTypes)
db.Book = require('../models/books')(sequelize, DataTypes)
db.Loan = require('../models/loan')(sequelize, DataTypes)


module.exports = db

