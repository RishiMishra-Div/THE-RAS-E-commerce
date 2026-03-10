const crypto = require("crypto");

const Product = require("../models/productModel");
const Order = require("../models/orderModel");


const razorpay = require("../config/razorpay");



/*
------------------------------------------
CREATE ORDER (COD or ONLINE)
------------------------------------------
*/

exports.createOrder = async (req, res) => {

  try {

    const { products, shippingDetails, paymentMethod } = req.body;
    const userId = req.user._id;

    let subtotal = 0;
    let orderItems = [];

    for (let item of products) {

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      const itemTotal = product.price * item.quantity;

      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        title: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });

    }

    const shipping = 100;
    const tax = subtotal * 0.05;

    const total = subtotal + shipping + tax;



    /*
    ------------------------------------------
    CREATE ORDER IN DATABASE
    ------------------------------------------
    */

    const order = await Order.create({

      user: userId,
      shippingDetails,

      items: orderItems,

      subtotal,
      shipping,
      tax,
      total,

      paymentMethod,

      paymentStatus: paymentMethod === "cod" ? "pending" : "pending"

    });



    /*
    ------------------------------------------
    IF PAYMENT METHOD = COD
    ------------------------------------------
    */

    if (paymentMethod === "cod") {

      return res.json({
        success: true,
        message: "Order placed with Cash on Delivery",
        order
      });

    }



    /*
    ------------------------------------------
    CREATE RAZORPAY ORDER
    ------------------------------------------
    */

    const options = {

      amount: Math.round(total * 100),

      currency: "INR",

      receipt: order._id.toString()

    };



    const razorpayOrder = await razorpay.orders.create(options);



    order.razorpayOrderId = razorpayOrder.id;

    await order.save();



    res.json({

      success: true,

      order,

      razorpayOrder

    });



  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Order creation failed"

    });

  }

};





/*
------------------------------------------
VERIFY PAYMENT
------------------------------------------
*/

exports.verifyPayment = async (req, res) => {

  try {

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature

    } = req.body;



    const body = razorpay_order_id + "|" + razorpay_payment_id;



    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");



    if (expectedSignature !== razorpay_signature) {

      return res.status(400).json({

        success: false,

        message: "Invalid payment signature"

      });

    }



    /*
    ------------------------------------------
    FIND ORDER
    ------------------------------------------
    */

    const order = await Order.findOne({

      razorpayOrderId: razorpay_order_id

    });



    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found"

      });

    }



    /*
    ------------------------------------------
    UPDATE ORDER STATUS
    ------------------------------------------
    */

    order.paymentStatus = "paid";

    order.razorpayPaymentId = razorpay_payment_id;

    order.razorpaySignature = razorpay_signature;

    order.status = "processing";



    await order.save();



    res.json({success: true,message: "Payment verified successfully",order});



  } catch (error) {

    console.error(error);

    res.status(500).json({success: false,message: "Payment verification failed"});

  }

};





/*
------------------------------------------
GET USER ORDERS
------------------------------------------
*/

exports.getMyOrders = async (req, res) => {

  try {

    const orders = await Order
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });



    res.json({success: true,orders});

  } catch (error) {

    res.status(500).json({success: false,message: "Failed to fetch orders"});

  }

};





/*
------------------------------------------
GET SINGLE ORDER
------------------------------------------
*/

exports.getOrder = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id)
      .populate("items.productId");



    if (!order) {

      return res.status(404).json({success: false,message: "Order not found"});

    }

    res.json({success: true,order});

  } catch (error) {

    res.status(500).json({

      success: false,

      message: "Failed to fetch order"

    });

  }

};