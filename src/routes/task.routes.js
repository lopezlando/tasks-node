const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const {
  errorsArray,
  validateCreateTask,
  validateModifyTask,
  validateParamsId,
  validateGetAll,
} = require('../validations/task.validation');

//routes
router.post('/create', validateCreateTask, errorsArray, taskController.create);

router.put(
  '/modify/:id',
  validateModifyTask,
  errorsArray,
  taskController.modify
);

router.delete(
  '/deleteTask/:id',
  validateParamsId,
  errorsArray,
  taskController.deleteTask
);

router.get('/:id', validateParamsId, errorsArray, taskController.getById);

router.get('/', validateGetAll, errorsArray, taskController.getAll);

module.exports = router;
