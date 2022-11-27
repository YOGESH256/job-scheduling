module.exports = (sequelize, DataTypes) => {

    const Job = sequelize.define('job',
    {


         priority : DataTypes.INTEGER,
         Job : DataTypes.STRING,
         timestamps : DataTypes.STRING,
          dep : DataTypes.STRING,

    },
    {
        freezeTableName: true
    });

    return Job;
}
