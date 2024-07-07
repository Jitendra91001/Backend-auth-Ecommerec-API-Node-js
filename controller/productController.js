const Product = require("../models/Productmodels");
const asyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../utils/catchAsyncError");
const ApiFeature = require("../utils/ApiFeature");

//create a product
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    status: true,
    message: "data created successfully",
    data: product,
  });
});

//get all products
exports.getAllproducts = catchAsyncError(async (req, res) => {
  const perpage = 10;
  const feature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(perpage);
  const product = await feature.query;
  const rowCount = await Product.countDocuments();
  res.status(200).json({ status: true, rowCount: rowCount, data: product });
});

//getSingal product

exports.getSingalProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    //     res.status(500).json({ status: false, message: "Product not found" });
    return next(new ErrorHandler("Product not found", 200));
  }
  res.status(200).json({ status: true, data: product });
});

//update product

exports.Updateproduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    //     res.status(500).json({ status: false, message: "Product not found" });
    return next(new ErrorHandler("Product not found", 200));
  }
  const Updatedproducts = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true, isModyfied: true }
  );
  res.status(200).json({
    status: true,
    data: Updatedproducts,
    message: "Product updated is successfully",
  });
});

//remove products

exports.removeproduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.deleteOne(req.params.id);

  res.status(200).json({
    status: true,
    data: product,
    message: "Product deleted successfully",
  });
});

exports.createproductReview = catchAsyncError(async (req, res, next) => {
  const { comment, rating, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  console.log(product);
  const isReviewed = product.reviews.find(
    (ele) => ele.user.toString() === req.user._id.toString()
  );
  //   console.log("data");

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.comment = comment), (rev.rating = rating);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.ratings =
    product.reviews.forEach((ele) => {
      avg += ele.rating;
    }) / product.reviews.length;

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    //     res.status(500).json({ status: false, message: "Product not found" });
    return next(new ErrorHandler("Product not found", 200));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.removeProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    //     res.status(500).json({ status: false, message: "Product not found" });
    return next(new ErrorHandler("Product not found", 200));
  }

  const reviews = product.reviews.filter((rev) => {
    console.log(rev._id.toString() !== req.query.id.toString());
  });
    let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
