const userService = require('../services/user.service');

module.exports = { authenticate, register, getAll, getById };

//LOGIN

/**
 *
 *
 * @param {string} email - body - user's email
 * @param {string} password - body - user's password
 * @returns {Object} user data along with a JWT.
 * @throws {Error} errors if email or password exceed character limits, or if credentials are invalid.
 * 
 */
function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((result) =>
      !result.errors ? res.json(result) : res.status(400).json(result)
    )
    .catch((err) => next(err));
}

//REGISTER

/**
 *
 *
 * @param {string} email - body - must have email format
 * @param {string} password - body - between 6 and 20 chars long
 * @param {string} name - body - between 2 and 30 chars long
 * @param {string} lastName - body - between 2 and 30 chars long
 * @returns {Object} created user
 * @throws {Error} errors if characters limitation/email format is wrong, or if email is already in use.
 */
function register(req, res, next) {
  userService
    .create(req.body)
    .then((result) =>
      !result.errors ? res.json(result) : res.status(400).json(result)
    )
    .catch((err) => next(err));
}

//GET ALL

/**
 *
 *
 * @param {number} [page] - query - pagination
 * @param {number} [limit] - query - items limit per page
 * @param {string} [name] - query - user name
 * @param {string} [lastName] - query - user last name
 * @param {string} [email] - query - user email
 * @param {string} id - urlpath - mongo objectId
 * @returns {Object} list of users
 * @throws {Error} errors if characters limitation/email format is wrong
 */
function getAll(req, res, next) {
  userService
    .getAll(req.query)
    .then((result) => res.json(result))
    .catch((err) => next(err));
}

//GET BY ID

/**
 *
 *
 * @param {string} id - urlpath - mongo objectId
 * @returns {Object} desired user
 * @throws {Error} errors if mongo ID format is invalid, or if there is no user with that ID.
 */
function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((result) =>
      !result.errors ? res.json(result) : res.status(404).json(result)
    )
    .catch((err) => next(err));
}
