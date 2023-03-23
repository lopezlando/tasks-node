module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  if (typeof err === 'string') {
    // custom application error
    return res.status(400).json({
      errors: [
        {
          msg: err,
        },
      ],
    });
  }

  if (err.name === 'ValidationError') {
    // mongoose validation error
    return res.status(400).json({
      errors: [
        {
          msg: err.message,
        },
      ],
    });
  }

  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).json({
      errors: [
        {
          msg: 'Invalid Token',
        },
      ],
    });
  }

  // default to 500 server error
  return res.status(500).json({
    errors: [
      {
        msg: err.message,
      },
    ],
  });
}

//useful to know what kind of error you're getting.
