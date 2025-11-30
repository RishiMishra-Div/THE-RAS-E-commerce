const express = require('express');
const router = express.Router();
const path = require('path')
const {isloggedIn} = require('../middlewares/isloggedIn')
const{isAdmin} = require('../middlewares/isAdmin')


// admin panel routes

router.get('/', isloggedIn, isAdmin , (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/adminpanel.html'));
});

router.get('/addProduct', isloggedIn, isAdmin , (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/adminPanel/addProduct.html'));
});


router.get('/manageProduct',  isloggedIn, isAdmin , (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/adminPanel/admin-manage-products.html'));
});

router.get('/edit/product',  isloggedIn, isAdmin , (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/adminPanel/admin-edit-product.html'));
});
router.get('/categories', isloggedIn, isAdmin , (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/adminPanel/admin-categories.html'));
});

router.get('/orders',  isloggedIn, isAdmin , (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/adminPanel/admin-orders.html'));
});


router.get('/users',  isloggedIn, isAdmin , (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/adminPanel/admin-users.html'));
});

module.exports = router;