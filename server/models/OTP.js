const mongoose= require('mongoose');
const mailSender = require('../utils/mailsender');
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
// ye schema h

const OTPSchema = new mongoose.Schema({
    email:
    {
        type: String,
        required: true,
    },
    otp:
    { 
        type: String,
        required: true,
    }, 
    createdAt:
    {
        // ye created date ka schema thora sa alag h.. isme default date.now h.. aur ye expire 600 h.. iska mtlb ye h ki ye 10 min baad expire ho jayega 
        type: Date,
        default: Date.now,
        expires: 5*60,
    },
    
});

// ab ham loog ek function banyenge ---> to send mail
async function sendVerificationEmail(email, otp)
{
    try{
        // ab hamko ek mail send karna h to .. iske lie ham mailSender naam ke function ka use karnege.... aur isko import bhi karna hoga
        
        const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
    }
    catch(error)
    {
		console.log("Error occurred while sending email: ", error);
		throw error;// par love ne ye kion likhawaya??
    }
}

// ab ham loog ek middleware function banayenge ---> to send mail.. aur ye ek pre middleware function h
OTPSchema.pre("save", async function(next){
    console.log("New document saved to database");
    // yahan se ham sendMail function ko call karenge... aur isme email aur otp pass karenge

    // par isme ye dekho ki... is baar hamne this.email aur this.otp likha h... <--- ye kuch alag h yahan
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();// ham mail aut otp sendMail ko send karne ke baad next middleware par jaynege... yaad rakho... ham sendmail ke responce ka wait nahi karnege... 
})

// ye model h
const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;

// kab funtion me let use hoga... kab responce me let use hoga.. kuch samajh nahi aata h...abhi tak..