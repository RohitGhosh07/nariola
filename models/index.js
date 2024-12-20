const Sequelize = require('sequelize');
const config = require('../config/config.js');
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, {
  host: config[env].host,
  dialect: config[env].dialect
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, Sequelize);
db.Article = require('./article')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
db.VideoRecord = require('./videoRecord')(sequelize, Sequelize);
db.Chat = require('./Chats.js')(sequelize, Sequelize); // Standardize naming: 'Chat'
db.Message = require('./Messages.js')(sequelize, Sequelize); // Standardize naming: 'Message'
db.LiveLocation = require('./LiveLocation.js')(sequelize, Sequelize); // Standardize naming: 'Message'
 

// Associations
db.User.hasMany(db.VideoRecord);
db.Article.hasMany(db.Comment);
db.User.hasMany(db.Comment);

// Updated associations
db.User.hasMany(db.Message); // Correct reference to db.Message
db.Chat.hasMany(db.Message); // Correct reference to db.Message

db.Message.belongsTo(db.User, { foreignKey: 'userId', as: 'sender' }); // Reference the correct model
db.Message.belongsTo(db.Chat, { foreignKey: 'chatId' });

db.User.belongsToMany(db.Chat, { through: 'ChatUsers', as: 'chats', foreignKey: 'userId' });
db.Chat.belongsToMany(db.User, { through: 'ChatUsers', as: 'participants', foreignKey: 'chatId' });

module.exports = db;
