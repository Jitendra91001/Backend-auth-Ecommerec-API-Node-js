const express = require("express");
const {
  getAllproducts,
  createProduct,
  getSingalProduct,
  Updateproduct,
  removeproduct,
  createproductReview,
  removeProductReviews,
  getProductReviews,
} = require("../controller/productController");
const { isAuthanticate, authorizesRoles } = require("../middlewere/auth");

const router = express.Router();
router.route("/products").get(isAuthanticate,getAllproducts);
router
  .route("/products/create")
  .post(isAuthanticate, authorizesRoles("admin"), createProduct);
router
  .route("/products/:id")
  .get(getSingalProduct)
  .put(isAuthanticate, authorizesRoles("admin"), Updateproduct)
  .get(isAuthanticate, authorizesRoles("admin"), removeproduct);

router.route("/review").put(isAuthanticate , createproductReview)
router.route("/review").get(getProductReviews).delete(isAuthanticate , removeProductReviews)
module.exports = router;
