const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
    },
  });

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

  return User;
};

module.exports = user;
