
const express = require("express");

const router = express.Router();

const {createOrder,verifyPayment,getMyOrders,getOrder} = require("../controllers/paymentController");



router.post("/create-order", createOrder);

router.post("/verify-payment", verifyPayment);

router.get("/my-orders", getMyOrders);

router.get("/:id", getOrder);



module.exports = router;