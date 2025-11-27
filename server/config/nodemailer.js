const nodemailer = require('nodemailer');      
module.exports.transporter = nodemailer.createTransport({
    host:"smtp-relay.brevo.com",
    port:587,
    auth:{
        user:process.env.user,
        pass:process.env.pass
    }

})