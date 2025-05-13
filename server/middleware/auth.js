const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// sabse phele ham token sahi h ya nahi ... ye check karenge..
exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        || req.body.token
        || req.header("Authorisation").replace("Bearer ", "");

        // ab chekc karenge ki token h ya nahi

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is Missing",
            });
        }

        // ab hamloog yahan par verify karenge.. ki token sahi h ya nahi
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decode); 
            req.user = decode; // <--- ye jo step hua h na... hamko nahi samajh aa rha h.. ye h kya...mtlb.. HMNE KIYA KYA ISME AAKHIR??
            // ans ----> hamne req ki body me decode ko add kar diya
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while validating the token',
        });
    }
}

// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        // ab hame sabse phele role chek karna hoga..
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Students only',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again'
        })
    }

}
// we will make authentication of
// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        // ab hame sabse phele role chek karna hoga..
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Instructor only',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        })
    }

}

// isAdmin

exports.isAdmin = async (req, res, next) => {
    try {
        // ab hame sabse phele role chek karna hoga..
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admin only',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again'
        })
    }

}
