const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")
const { deleteProfile, updateProfile, getUserDetails, updateDisplayPicture, getEnrolledCourses } = require("../controllers/Profile")
// console.log(deleteProfile , updateProfile, getUserDetails, updateDisplayPicture, getEnrolledCourses)

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteProfile)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router