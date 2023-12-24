const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
    const User =
        sequelize.define('users', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: {
                        msg: 'Please enter a valid email, i.e. name@email.com'
                    },
                    notEmpty: {
                        msg: "last name cannot be left blank"
                    }
                }
            },
            password: {
                type: DataTypes.STRING
            },
            library_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            profileImg: {
                type: DataTypes.STRING,
                allowNull: true
            },
            imgUrl: {
                type: DataTypes.VIRTUAL,
                get() {
                    return this.profileImg ? `localhost:3000/public/images/${this.profileImg}` : null
                }
            }

        },
            {
                timestamps: false,
                indexes: [
                    {
                        unique: true,
                        fields: ['email']
                    }
                ],
            }
        );
    User.associate = function (models) {
        User.hasMany(models.loan, {
            foreignKey: "user_id"
        })
    };
    return User;

}

