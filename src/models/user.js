const bcrypt = require('bcrypt');
const { User } = require('../resolvers/users');

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
  });

  User.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash(user.password);
  });

  User.prototype.generatePasswordHash = async (pass) => {
    const saltRounds = 10;
    return await bcrypt.hash(pass, saltRounds);
  };

  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  //Custom method
  User.FindByLogin = async (login) => {
    let me = await User.findOne({
      where: { username: login },
    });

    if (!me) me = await User.findOne({ where: { email: login } });

    return me;
  };

  User.validatePassword = async (password) => {
    // Compare existing pass and the one from args
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

module.exports = user;
