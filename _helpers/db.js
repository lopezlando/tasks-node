const { MONGODB_URI, DB_NAME } = require('../config');
const mongoose = require('mongoose'),
  connectionString = MONGODB_URI,
  connectionOptions = {
    dbName: DB_NAME,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

mongoose.connect(
  connectionString || 'mongodb://localhost/gruout',
  connectionOptions
);

mongoose.Promise = global.Promise;

module.exports = {
  connection: mongoose.connection,
  User: require('../src/models/user.model'),
  Task: require('../src/models/task.model'),
};
