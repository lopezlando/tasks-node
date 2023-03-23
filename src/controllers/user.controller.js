const userService = require('../services/user.service');

module.exports = { authenticate, register, getAll, getById };

//LOGIN
function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((result) =>
      !result.errors ? res.json(result) : res.status(400).json(result)
    )
    .catch((err) => next(err));
}

//REGISTER
function register(req, res, next) {
  userService
    .create(req.body)
    .then((result) =>
      !result.errors ? res.json(result) : res.status(400).json(result)
    )
    .catch((err) => next(err));
}

//GET FUNCTIONS
function getAll(req, res, next) {
  userService
    .getAll(req.query)
    .then((result) => res.json(result))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((result) =>
      !result.errors ? res.json(result) : res.status(404).json(result)
    )
    .catch((err) => next(err));
}
