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
      errorCode: 'R002',
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

async function getAll() {
  return await User.find();
}

async function getById(id) {
  return await User.findById(id);
}
