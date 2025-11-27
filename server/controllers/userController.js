const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { generateToken} = require('../utils/generateToken');
const {transporter} = require("../config/nodemailer")


 
// function for register user
module.exports.registerUser = async (req, res) => {
    let { fullname,email, password}= req.body;

    if(!fullname || !email || !password){
        return res.status(400).json({success : false , message:"please fill all the fields"});
    }

    try {
        const existingUser = await userModel.findOne({ email: email });
        if(existingUser){
          return res.status(400).json({ success : false , message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            fullname,
            email,
            role: 'user',
            password: hashedPassword
        });
        await newUser.save();
        const token = generateToken(newUser);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });

         // sending mail
            const mailOptions = {
                from:process.env.SENDER_EMAIL,
                to: email,
                subject: 'Welcome to THE RAS',
                text:`Welcome to THE RAS website.
                Your account has been created successfully
                with the email : ${email}`
            }
            await transporter.sendMail(mailOptions);

        res.status(201).json({ success : true , message: 'User registered successfully'});
    
    } catch (error) {
        return res.status(500).json({success : false , message:error.message});
    }
}
 
// function for login user
module.exports.loginUser = async (req, res) => {
    let { email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({success : false , message: "please fill all the fields"});
    }

    try {
        const userexists = await userModel.findOne({ email: email });
        if(!userexists){
            return res.status(400).json({success: false , message: 'you do not have an account, please register'});
        }
        const match = await bcrypt.compare(password, userexists.password)
        if(!match){
            return res.status(400).json({success: false , message: 'Invalid credentials' });
        }
        const token = generateToken(userexists);
        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });
        

        res.status(200).json({ success : true , message: 'Logged in successfully' });
        
    } catch (error) {
    return res.status(500).json({success : false , message: error.message});
    }
}

// function for logout user
module.exports.logoutUser = (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
       res.status(200).json({ message: 'Logged out successfully' });
    }catch (error) {
        return res.status(500).json({success : false , message: 'internal server error'});
    }
}

// function for  send verification otp
module.exports.sendVerifyOtp = async (req,res)=>{
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId);
        

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.isverified) {
            return res.json({ success: false, message: 'User already verified' });
        }

        const otp = String(Math.floor(100000+Math.random()*900000));


        user.verifyotp = otp;
        user.verifyotpexpiry = Date.now()+5*60*1000;

        await user.save();

        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'verification otp from THE RAS',
            text:`Your OTP is ${otp}. verify your account using this `
        }
        await transporter.sendMail(mailOptions);
        res.json({success: true , message: "verification OTP has been sent on email"})
    } catch (error) {
        return res.json({success : false , message : error.message})  
    }
}

// function for  verify otp and email verify
module.exports.verifyEmail = async (req,res)=>{
    const {otp} = req.body;
    const userId = req.user.id;

    if(!otp){
        return res.json({success : false , message : 'missing details'});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
           return res.json({success : false , message : 'user not found'});  
        }

        if(user.verifyotp === '' || user.verifyotp !== otp){
           return res.json({success : false , message : 'Invalid OTP'});
        }

        if(user.verifyotpexpiry < Date.now()){
           return res.json({success : false , message : 'Verification time has been expired'});
        }

        user.isverified = true;
        user.verifyotp = '';
        user.verifyotpexpiry = 0 ;
        
        await user.save();
        res.json({success: true , message : ' Your email has verified'})
    } catch (error) {
        return res.json({success : false , message : error.message});
    }

}

// function for password reset otp
module.exports.sendResetOtp = async (req,res)=>{
    const {email} = req.body;

    if(!email){
        return res.json({success: false , message: 'Email is required'})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false , message: 'Invalid credentials'})
        }
        
        const otp = String(Math.floor(100000+Math.random()*900000));


        user.resetotp = otp;
        user.resetotpexpiry = Date.now()+5*60*1000;

        await user.save();

        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password resetting otp',
            text:`Your password resetting OTP is ${otp}. 
            reset your password using this `
        }
        await transporter.sendMail(mailOptions);
        res.json({success: true , message: " Password resetting OTP has been sent on email"})
        
    } catch (error) {
        return res.json({success: false , message: error.message})
    }
}

// function for verify password reset otp and change password
module.exports.changePassword = async (req,res)=>{
    const { email, newPassword , otp } = req.body ;
    if(!email || !newPassword || !otp){
        return res.json({success: false , message: 'Email , New password and otp are required'})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false , message: 'Invalid credentials'})
        }
        if(user.resetotp === '' || user.resetotp !== otp){
            return res.json({success: false , message: 'Invalid OTP'})
        }

        if(user.resetotpexpiry < Date.now()){
            return res.json({success: false , message: 'OTP has been expired'})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword
        user.resetotp = '';
        user.resetotpexpiry= 0 ;

        await user.save();
        res.json({success: true , message: "password successfully changed"})
        
    } catch (error) {
        return res.json({success: false , message: error.message})
    }
}