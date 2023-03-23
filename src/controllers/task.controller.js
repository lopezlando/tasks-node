const taskService = require('../services/task.service');

module.exports = { create, modify, deleteTask, getById, getAll };

//CREATE

/**
 *
 *
 * @param {string} name - body - required, at most 50 chars
 * @param {string} [description] - body - optional, at most 300 chars
 * @param {string} [completed] - body - boolean, defaults to false
 * @returns {Object} created task
 * @throws {Error} errors if characters limitation is exceeded, if the boolean field is not a boolean, or if no name is provided.
 */
function create(req, res, next) {
  taskService
    .create(req.body)
    .then((result) =>
      result
        ? res.json(result)
        : res.status(400).json({ message: 'Uncaught error' })
    )
    .catch((err) => next(err));
}

//MODIFY

/**
 *
 *
 * @param {string} [name] - body - at most 50 chars
 * @param {string} [description] - body - at most 300 chars
 * @param {string} [completed] - body - boolean
 * @param {string} id - urlpath - mongo objectId
 * @returns {Object} modified task - all fields are optional since we can choose to only modify the fields we want to.
 * @throws {Error} errors if characters limitation is exceeded, if the boolean field is not a boolean, or if name is provided an empty value.
 */
function modify(req, res, next) {
  taskService
    .modify(req.params.id, req.body)
    .then((result) =>
      !result.errors ? res.json(result) : res.status(404).json(result)
    )
    .catch((err) => next(err));
}

//DELETE

/**
 *
 *
 * @param {string} id - urlpath - mongo objectId
 * @returns {Object} task deleted message
 * @throws {Error} errors if the id format is invalid, or if there's no task with that ID.
 */
function deleteTask(req, res, next) {
  taskService
    .deleteTask(req.params.id)
    .then((result) =>
      !result.errors ? res.json(result) : res.status(404).json(result)
    )
    .catch((err) => next(err));
}

//GET BY ID

/**
 *
 *
 * @param {string} id - urlpath - mongo objectId
 * @returns {Object} task with the specified ID
 * @throws {Error} errors if the id format is invalid, or if there's no task with that ID.
 */
function getById(req, res, next) {
  taskService
    .getById(req.params.id)
    .then((result) =>
      !result.errors ? res.json(result) : res.status(404).json(result)
    )
    .catch((err) => next(err));
}

//GET ALL

/**
 *
 *
 * @param {string} id - urlpath - mongo objectId
 * @param {number} [page] - query - pagination
 * @param {number} [limit] - query - items limit per page
 * @param {string} [name] - query - at most 50 chars
 * @param {string} [description] - query - at most 300 chars
 * @param {string} [completed] - query - boolean
 * @returns {Object} list of tasks
 * @throws {Error} errors if characters limitation/format is wrong
 */
function getAll(req, res, next) {
  taskService
    .getAll(req.query)
    .then((tasks) => res.json(tasks))
    .catch((err) => next(err));
}
