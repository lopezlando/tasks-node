const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

//routes
router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);

module.exports = router;
