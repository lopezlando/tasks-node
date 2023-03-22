const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

//routes
router.post('/create', taskController.create);
router.put('/modify/:id', taskController.modify);
router.delete('/deleteTask/:id', taskController.deleteTask);
router.get('/:id', taskController.getById);
router.get('/', taskController.getAll);

module.exports = router;
