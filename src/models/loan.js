module.exports = (sequelize, DataTypes) => {
    const Loan = sequelize.define('loan', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        book_id: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: "Book ID cannot be left blank"
                }
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: "Patron ID cannot be left blank"
                }
            }
        },
        author_on: {
            type: DataTypes.DATEONLY,
            validate: {
                isDate: {
                    msg: "Return By must be a valid date"
                }
            }
        },
        return_by: {
            type: DataTypes.DATEONLY,
            validate: {
                isDate: {
                    msg: "Return By must be a valid date"
                }
            }
        },
        returned_on: {
            type: DataTypes.DATEONLY,
            validate: {
                isDate: {
                    msg: "Returned On must be a valid date"
                }
            }
        }
    }, {
        timestamp: false,
        indexes: [
            {
                unique: false,
                fields: ['author_on']
            },
            {
                unique: false,
                fields: ['return_by']
            }
        ]
    });
    Loan.associate = function (models) {
        Loan.belongsTo(models.books, {
            foreignKey: "book_id"
        })
        Loan.belongsTo(models.users, {
            foreignKey: "user_id"
        })
    };
    return Loan;
}