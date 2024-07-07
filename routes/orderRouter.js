const express = require("express");
const router = express.Router();
const { isAuthanticate, authorizesRoles } = require("../middlewere/auth");
const { newOrder, getSingalOrders, myOrders, getAllOrders, updateOrders, deleteOrders } = require("../controller/OrderController");

//all order router
router.route("/order/new").post(isAuthanticate, newOrder);
router.route("/order/:id").get(isAuthanticate , getSingalOrders);
router.route("/orders/me").get(isAuthanticate, myOrders);

router.route("/admin/orders").get(isAuthanticate , authorizesRoles("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthanticate , authorizesRoles("admin") , updateOrders).delete(isAuthanticate , authorizesRoles("admin") , deleteOrders)

module.exports = router