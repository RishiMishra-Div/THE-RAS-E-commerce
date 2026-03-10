
const express = require("express");

const router = express.Router();

const {createOrder,verifyPayment,getMyOrders,getOrder} = require("../controllers/paymentController");
const {isloggedIn}= require("../middlewares/isloggedIn");



router.post("/create-order", isloggedIn, createOrder);

router.post("/verify-payment", isloggedIn, verifyPayment);

router.get("/my-orders", isloggedIn, getMyOrders);

router.get("/:id", isloggedIn, getOrder);



module.exports = router;