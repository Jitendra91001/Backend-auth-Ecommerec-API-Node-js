const mongoose = require("mongoose");
const validator = require("validator");
const bcript = require("bcryptjs");
const json = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    maxLength: [30, "name cannot exceed 30 charector"],
    minLength: [4, "name should have more than 4 charector"],
  },

  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validator: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    maxLength: [8, "password is grater than 4 charector"],
    select: false,
  },
  role: {
    type: String,
    defalut: "user",
  },
  avatar: {
    public_id: {
      type: String,
      required: [true, "please enter the public_id"],
      default: "your sympal profile image",
    },
    url: {
      type: String,
      required: [true, "please enter the url"],
      default: "userprofile Pic url",
    },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcript.hash(this.password, 10);
});
UserSchema.methods.Jwttoken = function () {
  return json.sign({ id: this._id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.comparePassword = async function (enterPassword) {
  return bcript.compare(enterPassword, this.password);
};

UserSchema.methods.reserpassword = async function (enterpassword) {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("User", UserSchema);
