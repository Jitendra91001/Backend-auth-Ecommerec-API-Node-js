const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../utils/catchAsyncError");
const ApiFeature = require("../utils/ApiFeature");
const User = require("../models/Usermodels");
const sendtoken = require("../utils/sendtoken");
const sendMail = require("../utils/SendEmail");
const crypto = require("crypto");

//Ragistration user

exports.createUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!req.body.role) {
    req.body.role = "user";
  }
  const user = await User.create(req.body);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  sendtoken(user, 201, res);
});

// login users

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("please enter the email and password", 404));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("email and password Incorrect", 404));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 404));
  }
  //   res
  //     .status(200)
  //     .json({ success: true, message: "user Login successful", token:token , data:user });

  sendtoken(user, 200, res);
});

//getAll users

exports.getAllusers = catchAsyncError(async (req, res, next) => {
  const user = await User.find();

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({ success: true, data: user });
});

exports.deleteAllRecords = catchAsyncError(async (req, res, next) => {
  const user = await User.deleteMany({});

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({ success: true, data: user });
});

//lorout users

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "User Logout successfully" });
});

exports.forgotpassword = catchAsyncError(async (req, res, next) => {
  const user = await User.find({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found ", 404));
  }

  const resetToken = user.reserpassword();

  await user.save({ validateBeforeSave: true });

  const resetPasswordurl = `http://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `your Password reset token is :- \n\n ${resetPasswordurl} \n\n you have not ragisterd this email then , please ignore it`;

  try {
    sendMail({
      email: user.email,
      Subject: `Ecommerec Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: true });

    next(new ErrorHandler(error?.message));
  }
});

exports.forgotpassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password Token is inValid  or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.comparePassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  (user.password = req.body.password),
    (user.resetPasswordToken = undefined),
    (user.resetPasswordExpire = undefined),
    await user.save();
  story;
  sendtoken(user, 200, res);
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("old Password is Incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not matched", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendtoken(user, 200, res);
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.user.name,
    email: req.user.email,
  };

  const user = User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  res.status(200).json({
    success: true,
  });
});

//admin get all users
exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new ErrorHandler("User does not exist", 400));
  }
  res.status(200).json({
    status: true,
    users,
  });
});

//admin get singal users
exports.getsingalUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.findById(req.params.id);

  if (!users) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    status: true,
    users,
  });
});

//update user role ---admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  //

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  res.status(200).json({
    success: true,
  });
});

//delete user roles for admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  if (!user) {
    return next(
      new ErrorHandler("this user not exist with id :" + req.params.id, 400)
    );
  }

  await user.remove();
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully !",
  });
});

//find by user Details for User
