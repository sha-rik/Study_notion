const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


exports.resetPasswordToken = async (req, res) => {
    try {
        // take out the data from reqest body

        const email = req.body.email;

        // confirm that user exist
        const user = await User.findOne({ email: email });
        console.log("--->sdkjfskdfj<---");

        if (!user) {
            return res.json({
                success: false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
            });
        }

        // ab ham token generate karenge... aur expiration time generate karenge

        const token = crypto.randomBytes(20).toString("hex");
        console.log(token);

        // fir user ko update karenge.. by adding token and expiration time.... findByIdAndUpdate me ham email ke basis par search kar rahe h...

        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000,
            },
            { new: true } //  <-- new true mark karne se... jo responce return hoga... usme db ke updated details honge
        );

        //  we will create the url
        const url = `http://localhost:3000/update-password/${token}`; // <-- this the url of frontend .. we are running it in localhost 3000

        // send the mail  with the help of mailsender
        await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        // response send karo
        res.json({
            success: true,
            message:
                "Email Sent Successfully, Please Check Your Email to Continue Further",
        });

    }
    catch (error) {
		return res.status(501).json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
    }

}

exports.resetPassword = async (req, res) => {
    // hamare pass token , new password, aur confirm password aayega...
    // par ham token kion use kar rahe h???

    // the reason is , abhi hamare pass kuch bhi aisha nahi h.. jisse ham...
    // user ko identify kar saken... this is my ham tken ka use kar rahe h... (uniqily identify karne ke liye) 

    try {
        // so the flow is

        // data fetch
        const { password, confirmPassword, token } = req.body; // <-- par ye token kahan se aa gaya req ki body me?? .. samajh nahi aaya

        // validation
		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}



        // get userdetails using token
        const userDetails = await User.findOne({ token: token });

        // if no entry  - invalid token
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}

        // has the token has been expire // token time check 

		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}



        // fir hamene new password ko hash kar diya..
        const encryptedPassword = await bcrypt.hash(password, 10);

        // password ko update kar diya db me 

        await User.findOneAndUpdate(
            { token: token },
            { password: encryptedPassword },
            { new: true }
        );

		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
    }
    catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
    }
}