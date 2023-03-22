const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {
  errorsArray,
  validateUserAuthenticate,
  validateUserCreate,
  validateParamsId,
  validateGetAll,
} = require('../validations/user.validation');

//routes
router.post(
  '/authenticate',
  validateUserAuthenticate,
  errorsArray,
  userController.authenticate
);

router.post(
  '/register',
  validateUserCreate,
  errorsArray,
  userController.register
);

router.get('/', validateGetAll, errorsArray, userController.getAll);

router.get('/:id', validateParamsId, errorsArray, userController.getById);

module.exports = router;
