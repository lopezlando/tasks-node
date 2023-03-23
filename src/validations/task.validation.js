const { check, param, query, validationResult } = require('express-validator');

const errorsArray = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};

const validateCreateTask = [
  check('name', 'Name is required and should be at most 50 characters')
    .notEmpty()
    .if((value) => !value.isEmpty())
    .isLength({ min: 1, max: 50 }),
  check('description', 'Description should be at most 300 characters')
    .optional()
    .isLength({ max: 300 }),
  check('completed', 'Completed should be a boolean value')
    .optional()
    .isBoolean(),
];

const validateModifyTask = [
  param('id', 'Invalid ID, must be a Mongo ObjectID').isMongoId(),
  check('name', 'Name should be at most 50 characters')
    .optional()
    .isLength({ min: 1, max: 50 }),
  check('name', 'Name cannot be empty').if(check('name').exists()).notEmpty(),
  check('description', 'Description should be at most 300 characters')
    .optional()
    .isLength({ max: 300 }),
  check('completed', 'Completed should be a boolean value')
    .optional()
    .isBoolean(),
];

const validateParamsId = [
  param('id', 'Invalid ID, must be a Mongo ObjectID').isMongoId(),
];

const validateGetAll = [
  query('name', 'Name should be at most 50 characters')
    .optional()
    .isLength({ max: 50 }),
  query('description', 'Description should be at most 300 characters')
    .optional()
    .isLength({ max: 300 }),
  query('completed', 'Completed should be a boolean value')
    .optional()
    .isBoolean(),
];

module.exports = {
  errorsArray,
  validateCreateTask,
  validateModifyTask,
  validateParamsId,
  validateGetAll,
};
