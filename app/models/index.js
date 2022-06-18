const Sequelize = require('sequelize');

// setup sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'mullegro.sqlite3',
    logging: false
});

// connect to db
sequelize.authenticate()
    .then(() => {
        console.log('>> Connected to database...');
    })
    .catch(err => {
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
db.transcations = require('./transcation')(sequelize, Sequelize);

// establish relationships
db.users.hasMany(db.posts);
db.posts.belongsTo(db.users);

db.users.hasOne(db.carts);
db.carts.belongsTo(db.users);

db.carts.hasMany(db.posts);
db.posts.belongsTo(db.carts);

db.users.hasMany(db.transcations);
db.transcations.belongsTo(db.users);

db.transcations.hasMany(db.posts);
db.posts.belongsTo(db.transcations);

// export db
module.exports = db;