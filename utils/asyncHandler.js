const asyncHandler = (req, res, next) => {
  Promise.resolve(asyncHandler(req, res, next)).catch((err) => next(err));
};

module.exports = asyncHandler;
