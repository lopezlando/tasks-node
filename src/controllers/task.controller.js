const taskService = require('../services/task.service');

module.exports = { create, modify, deleteTask, getById, getAll };

//CREATE
function create(req, res, next) {
  taskService
    .create(req.body)
    .then((task) =>
      task ? res.json(task) : res.status(400).json({ message: 'error' })
    )
    .catch((err) => next(err));
}

//MODIFY
function modify(req, res, next) {
  taskService
    .modify(req.params.id, req.body)
    .then((task) =>
      task ? res.json(task) : res.status(400).json({ message: 'error' })
    )
    .catch((err) => next(err));
}

//DELETE
function deleteTask(req, res, next) {
  taskService
    .deleteTask(req.params.id)
    .then((task) =>
      task ? res.json(task) : res.status(400).json({ message: 'error' })
    )
    .catch((err) => next(err));
}

//GET FUNCTIONS
function getById(req, res, next) {
  taskService
    .getById(req.params.id)
    .then((task) => (task ? res.json(task) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  taskService
    .getAll(req.query)
    .then((tasks) => res.json(tasks))
    .catch((err) => next(err));
}
