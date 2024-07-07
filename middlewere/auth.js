const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/Usermodels");

exports.isAuthanticate = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  
  const decodedData = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
  
  req.user = await User.findById(decodedData?.id);
  next();
});

exports.authorizesRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role ${req.user.role} is not allowed this resource`)
      );
    }
    next();
  };
};
