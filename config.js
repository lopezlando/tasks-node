const path = require('path');

let envFile = '.env';
if (process.env.NODE_ENV === 'test') {
  envFile = '.env.test';
}

require('dotenv').config({
  path: path.resolve(__dirname, envFile),
});

module.exports = {
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  JWT_DURATION: process.env.JWT_DURATION,
};
