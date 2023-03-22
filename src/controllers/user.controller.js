const userService = require('../services/user.service');

module.exports = { authenticate, register, getAll, getById };

//LOGIN
function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: 'incorrect username or password.' })
    )
    .catch((err) => next(err));
}

//REGISTER
function register(req, res, next) {
  userService
    .create(req.body)
    .then((user) =>
      user ? res.json(user) : res.status(400).json({ message: 'Email in use' })
    )
    .catch((err) => next(err));
}

//GET FUNCTIONS
function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}