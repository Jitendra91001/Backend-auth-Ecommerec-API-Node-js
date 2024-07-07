const Order = require("../models/Ordermodels");
const Product = require("../models/Productmodels");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../utils/catchAsyncError");
// const ApiFeature = require("../utils/ApiFeature");
// const User = require("../models/Usermodels");
// const sendtoken = require("../utils/sendtoken");
// const sendMail = require("../utils/SendEmail");

//create new Order

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItem,
    ShippingInfo,
    itemsPrice,
    totalPrice,
    ShippingPrice,
    taxPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    ShippingInfo,
    orderItem,
    paymentInfo,
    itemsPrice,
    taxPrice,
    ShippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    status: true,
    order,
  });
});

// get singal order in order api
exports.getSingalOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!orders) {
    return next(new ErrorHandler("Order does not exist", 200));
  }

  res.status(200).json({
    status: true,
    orders,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//get all orders  -- Admin

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({});

  let totalamount = 0;

  order.forEach((ele) => {
    totalamount += ele.totalPrice;
  });

  res.status(200).json({
    status: true,
    totalamount,
    order,
  });
});

//update order status  -- Admin

exports.updateOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.OrderStatus === "Delivered") {
    return next(
      new ErrorHandler("you have allready delivered this order", 400)
    );
  }

  order.orderItem?.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });

  order.OrderStatus = req.body.status;

  if (order?.OrderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    status: true,
    order,
  });
});

async function updateStock(id, quantity) {
  const product = Product.findById(id);

  product.Stock -= quantity;
  await Product.save({ validateBeforeSave: false });
}

// delete orders
exports.deleteOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.deleteOne({_id : req.params.id});
  if (!order) {
    return next(new ErrorHandler("order not found this id", 404));
  }



  res.status(200).json({
    status: true,
  });
});
