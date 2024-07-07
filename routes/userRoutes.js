const express = require("express");
const { createUser, getAllusers, loginUser, logoutUser, forgotpassword, updatePassword, getAllUser, getsingalUsers, updateUserRole, deleteUser ,deleteAllRecords} = require("../controller/UserController");
const { isAuthanticate, authorizesRoles } = require("../middlewere/auth");

const router = express.Router();
router.route("/users").get(getAllusers);
router.route("/deletemany").get(deleteAllRecords);
router.route("/users/create").post(createUser);
router.route('/users/login').post(loginUser);
router.route('/users/logout').get(logoutUser);
router.route("/users/forgotPassword").post(forgotpassword);
router.route("/users/updatepassword").put(isAuthanticate , updatePassword);

//profile roles 

//admin roles
router.route("/admin/users").get(isAuthanticate,authorizesRoles("admin"),getAllUser);
router.route("/admin/users/:id").get(isAuthanticate,authorizesRoles("admin"),getsingalUsers).put(isAuthanticate,authorizesRoles("admin"),updateUserRole).delete(isAuthanticate,authorizesRoles("admin"),deleteUser);
module.exports = router;
