// aisha lagta h.. ki.. code ka flow yahi se start hoga..
const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();


// sendOTP... BTW the way we are generation uniequ OTP is not optimal way

exports.sendOTP = async (req, res) => {
    try {
        // we will fetch email
        const { email } = req.body;

        // ab ham DB me check karenge ki kya user exist karta h?
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "user already exist",
            })
        }


        // ab ham OTP ko generate karenge .. with the help of a packeage
        // "otp-generator": "^4.0.1"
        const otp = otpGenerator.generate(
            6, // length of otp
            {
                upperCase: false,
                specialChars: false,
                lowerCaseAlphabets: false,
                digits: true,
            }
        );

        let val = 0;
        console.log(`OTP generated --> `, otp);
        // ab ham check karenge ki jo OTP aaya h.. wo unique h ya nahi
        let checkOtpPresent = await OTP.findOne({ otp: otp });
        // to agar OTP unique nahi h to ham fir se OTP generate karenge

        while (checkOtpPresent) {
            val++;
            otp = otpGenerator.generate(
                6, // length of otp
                {
                    upperCase: false,
                    specialChars: false,
                    lowerCaseAlphabets: false,
                    digits: true,
                }

            );
            console.log(`OTP generated --> `, otp);
            checkOtpPresent = await OTP.findOne({ otp: otp });
        }

        console.log(`On ${val}th unique OTP generated --> `, otp);

        // ab ham otp ka object create karenge...
        const constPayLoad = { email, otp };
        // ab ham iski entry create karenge DB me 
        const otpEntry = await OTP.create(constPayLoad);
        console.log(`OTP entry created in DB`, otpEntry);

        return res.status(200).json({
            success: true,
            message: `OTP sent successfully`,
        })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: `Error in sending OTP`,
        })
    }

}

exports.signup = async (req, res) => {
    try {
        // signup me sabse  phelr ham data fetch karenge
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        }
            = req.body;

        // ab ham check karenge ki kya sabhi details fill kiye gaye h ya nahi
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(401).json({
                success: false,
                message: "Please fill all the details",
            })
        }
        // ab ham check karenge ki kya password aur confirmPassword same h ya nahi
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Password and confirm password should be same",
            });
        }

        // ab ham check karnge ki... user phele se kahi exist to nahi karta h...
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                sucess: false,
                message: "User a;rady exist",
            });
        }

        // ab ham check karenge ki kya user ka OTP sahi h ya nahi... aur hamare DB me multiple OTP ho sakta h... 
        // so hamko .. sabe resent otp chahiye hoga...
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(`recent OTP is --> `, recentOtp);
        if (!recentOtp || recentOtp.otp !== otp) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        // ab ham password ko Hash karenge...

        const hashedPassword = await bcrypt.hash(password, 10); // <--- ye line na bahut chota sa lagta h... par.. isse sandeep ko achche se sawal
        // pucha tha... tumse bhi puchega.. to indepth tumko.. crypto graphy ka puchna hoga...

        // ab ham additional details ko create karenge... kion ki usko bhi DB me entry karni h...

        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });
        const encodedName = encodeURIComponent(`${firstName} ${lastName}`);




        // ab ham db me entry create karenge...
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            contactNumber,

            approved: approved,
            additionalDetails: profileDetails._id, // additionalDetails ke liye haamne jo profileDetails create kiya h.. uska id ko store kar liya..
            // image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
            image: `https://api.dicebear.com/9.x/initials/svg?seed=${encodedName}`,

            // par love ne course progress ka bhi id diya h... 
            // aur course bhi nahi likha h
        })

        // console.log(user);

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        });

    }
    catch (err) {
        console.log("this error is comming from signUp --> ", err);
        return res.status(500).json({
            success: false,
            message: 'User cannot be register please try again',
        })
    }
}

exports.login = async (req, res) => {
    try {
        // sabse phele ham data fetch karenge
        const { email, password } = req.body;

        // ab ham check karenge ki.. sara data filled h ya nahi
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: "Please fill all the details",
            })
        }
        
        // ab ham check karenge ki user exist karta h ya nahi
        const user = await User.findOne({ email }).populate("additionalDetails");
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User do not exist, please Signup first",
            })
        }
        
        // ab ham password check karenge.. aur iske liye ham bcrypt ka compare function use karnege...
        if (await bcrypt.compare(password, user.password)) {
            
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType, // <-- hamne token banane waqt hi... payload me role manually daal diya...
            }

            // agar password match hota h to fir ham... token create karenge... with the help of sign function <-- ye samjhne ke liye.. isse phele ka
            // backend development + express -2 me  padhaya h...
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '24h',
            });

            

            user.token = token
            user.password = undefined;

            // console.log(user);

            

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }

            


            

            // ab ham cookie banayege..
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'Loged in Successfully',
            })
        }
        else {
            
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            })
        }



    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Error while login occured",
        })
    }
}

// HOMEWORK  <--- but you just copied the code...
exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id);

        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
                .status(401)
                .json({ success: false, message: "The password is incorrect" });
        }

        // Match new password and confirm new password
        if (newPassword !== confirmNewPassword) {
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
            return res.status(400).json({
                success: false,
                message: "The password and confirm password does not match",
            });
        }

        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );

        // Send notification email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        // Return success response
        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
};




