const Sequelize = require('sequelize');

// setup sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'src/mullegro.sqlite3',
  logging: false
});

// connect to db
sequelize
  .authenticate()
  .then(() => {
    console.log('>> Connected to database...');
  })
  .catch((err) => {
    console.log('>> Error' + err);
  });

//setup db
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// import models
db.users = require('./user')(sequelize, Sequelize);
db.posts = require('./post')(sequelize, Sequelize);
db.carts = require('./cart')(sequelize, Sequelize);
db.transactions = require('./transaction')(sequelize)(Sequelize);

// establish relationships
db.users.hasMany(db.posts);
db.posts.belongsTo(db.users);

db.users.hasOne(db.carts);
db.carts.belongsTo(db.users);

db.carts.hasMany(db.posts);
db.posts.belongsTo(db.carts);

db.users.hasMany(db.transactions);
db.transactions.belongsTo(db.users);

db.transactions.hasMany(db.posts);
db.posts.belongsTo(db.transactions);

// export db
module.exports = db;
