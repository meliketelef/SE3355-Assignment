const { Sequelize } = require('sequelize');

// SQLite veritabanı ayarı
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Veritabanı dosyasının adı ve yolu
    logging: false, // Konsola SQL sorguları yazmasın
});

module.exports = sequelize;
