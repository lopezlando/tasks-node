const path = require('path');

// connects to test environment for unit testing
let envFile = '.env';
if (process.env.NODE_ENV === 'test') {
  envFile = '.env.test';
}

require('dotenv').config({
  path: path.resolve(__dirname, envFile),
});

//env variables exported
module.exports = {
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_DURATION: process.env.JWT_DURATION,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  DB_LOCAL_URI: process.env.DB_LOCAL_URI,
  DB_LOCAL_NAME: process.env.DB_LOCAL_NAME,
};
