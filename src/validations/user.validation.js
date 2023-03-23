const { check, param, query, validationResult } = require('express-validator');

const errorsArray = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};

const validateUserAuthenticate = [
  check('email', 'Email should not exceed maximum email length.')
    .optional()
    .isLength({ max: 254 }),
  check('password', 'Password must be at most 20 characters long.').isLength({
    max: 20,
  }),
];

const validateUserCreate = [
  check('email', 'Email is not valid.').isEmail(),
  check(
    'password',
    'Password must be between 6 and 20 characters long.'
  ).isLength({
    min: 6,
    max: 20,
  }),
  check('name', 'Name must be between 2 and 30 characters long.').isLength({
    min: 2,
    max: 30,
  }),
  check(
    'lastName',
    'Last Name must be between 2 and 30 characters long.'
  ).isLength({
    min: 2,
    max: 30,
  }),
];

const validateParamsId = [
  param('id', 'Invalid ID, must be a Mongo ObjectID').isMongoId(),
];

const validateGetAll = [
  query('email', 'Email should not exceed maximum email length')
    .optional()
    .isLength({ max: 254 }),
  query('name', 'Name should be at most 50 characters')
    .optional()
    .isLength({ max: 50 }),
  query('lastName', 'Last name should be at most 50 characters')
    .optional()
    .isLength({ max: 50 }),
];

module.exports = {
  errorsArray,
  validateUserAuthenticate,
  validateUserCreate,
  validateParamsId,
  validateGetAll,
};
