const express = require('express');
const router = express.Router();
const { registerUser , loginUser , logoutUser, sendVerifyOtp, verifyEmail,sendResetOtp,changePassword } = require('../controllers/authController');
const {isloggedIn} = require('../middlewares/isloggedIn')

router.get('/', (req, res) => {
    res.send('Welcome user');
});

router.post('/signup', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.post('/send-verify-otp', isloggedIn ,sendVerifyOtp );

router.post('/verify-account',isloggedIn , verifyEmail);

router.post('/send-reset-password-otp',sendResetOtp );

router.post('/reset-password',changePassword );

router.get('/me', isloggedIn, (req, res) => {
  res.json(req.user); // user came from middleware
});






module.exports = router;