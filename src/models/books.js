module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('books', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        first_published: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: "Please enter a year in numeric form, i.e. 2018"
                }
            }
        }
    },
        {
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ['title']
                }
            ]

        });
    Book.associate = (models) => {
        Book.hasMany(models.loan, {
            foreignKey: "book_id"
        })
    };
    return Book
}