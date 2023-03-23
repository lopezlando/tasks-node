const { PORT } = require('./config');
require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/tasks', require('./src/routes/task.routes'));

// global error handler
app.use(errorHandler);

// start server
const port = PORT || 3000;
const server = app.listen(port, function () {
  process.env.NODE_ENV !== 'test' &&
    console.info(`Server running on port ${port}`);
});

module.exports = { app, server };
