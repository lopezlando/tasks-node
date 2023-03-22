const {
  MONGODB_URI,
  DB_NAME,
  DB_LOCAL_URI,
  DB_LOCAL_NAME,
} = require('../config');
const mongoose = require('mongoose');

// if the is no mongodb URI to connect to, it'll connect to a local DB instead.
const connectionString = MONGODB_URI || DB_LOCAL_URI;
const dbName = DB_NAME || DB_LOCAL_NAME;
const connectionOptions = {
  dbName,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(connectionString, connectionOptions);

mongoose.Promise = global.Promise;

module.exports = {
  connection: mongoose.connection,
  User: require('../src/models/user.model'),
  Task: require('../src/models/task.model'),
};
