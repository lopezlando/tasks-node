const { SECRET_KEY, JWT_DURATION } = require('../../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const User = db.User;

module.exports = {
  authenticate,
  create,
  getAll,
  getById,
};

//LOGIN

async function authenticate({ email, password }) {
  const user = await User.findOne({ email });

  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id }, SECRET_KEY, {
      expiresIn: JWT_DURATION,
    });
    return {
      ...user.toJSON(),
      token,
    };
  }
}

//REGISTER
async function create(userParam) {
  const existing = await User.findOne({ email: userParam.email });

  if (existing) {
    return (error = {
      message: 'Email already in use.',
      errorCode: 'E01',
      errorCode: 'E01',
    });
  }

  const user = new User({
    ...userParam,
    createdAt: Date.now(),
  });

  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  await user.save();

  return { ...user.toJSON() };
}

//BASIC GET FUNCTIONS

async function getAll(queryParams) {
  // defaults/formats the page and limit parameters
  let page = Number(queryParams.page),
    limit = Number(queryParams.limit);

  !limit || limit < 1 || (isNaN(limit) && (limit = 10));

  !page || page <= 1 || isNaN(page) ? (page = 0) : (page = (page - 1) * limit);

  // filtering options
  const filter = {};

  queryParams.name &&
    (filter.name = { $regex: queryParams.name, $options: 'i' });

  queryParams.lastName &&
    (filter.lastName = { $regex: queryParams.lastName, $options: 'i' });

  queryParams.email &&
    (filter.email = { $regex: queryParams.email, $options: 'i' });

  //db query
  return await User.find(filter).sort({ createdAt: 1 }).skip(page).limit(limit);
}

async function getById(id) {
  const user = await User.findById(id);
  if (!user) return { error: 'There is no user with that ID.' };
  else return user;
}
