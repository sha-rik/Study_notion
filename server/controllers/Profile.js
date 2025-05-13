const Profile = require('../models/Profile');
// aur hame... user id ka requirement h..
const User = require('../models/User');
const { uploadImagetoCloudinary } = require("../utils/imageUploader");

// ham profile ko create nahi karenge... ham usko sirf... update karenge.. as profile to tab hi
// create ho gaya tha... jab user create hua tha... to ab hame sirf update karna h...

exports.updateProfile = async (req, res) => {
  try {
    // get the data
    const { dateOfBirth = "", about = "", contactNumber } = req.body;
    // get the user id jahan par.. ham ye sab update karnge... <---- IMP
    // get userid
    const id = req.user.id; // <--- ye samajh nahi aaya... ki.. ye user.. req ki body me kaisa aaya??

    // validation
    if (!contactNumber || !id || !dateOfBirth || !about) {
      return res.status(401).json({
        success: false,
        message: `All fields are required`,
      })
    }



    // find profile
    const userDetails = await User.findById(id); //<-- ham phele user ka id pata lagenge..
    // aur fir usske andar se profile leke ayenge
    // aur fir usske andar se profile leke ayenge

    const profile = await Profile.findById(userDetails.additionalDetails);

    // update profile
    profile.about = about;
    profile.contactNumber = contactNumber;

    profile.dateOfBirth = dateOfBirth;

    // profileDetails.gender=gender; // <-- par abhi tak ye 4 details DB me save nahi hue h...
    await profile.save(); // ye bhi ek tarika hota h.. jab.. object phele se hi create ho..
    // return response 

    return res.status(200).json({
      success: true,
      message: `Update the profile successfully`,
      // profileDetails,
      profile,
    })

  }
  catch (error) {
    console.log("lkdfsldkf--->", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

// --------- X X X X X ----------------------------- Use less code maybe --------- X X X X X -----------------------------

// const profileId = userDetails.additionalDetails;
// ab.. profile ki id nikalo..
// const profileDetails = await Profile.findById(profileId);

// --------- X X X X X ----------------------------- Use less code maybe --------- X X X X X -----------------------------

// delete profile
// HW: hwo to schedule the deletion of profile, and WHat is CRONEJOB?
exports.deleteProfile = async (req, res) => {
  try {
    // get the user id
    const id = req.user.id; // <--- ye samajh nahi aaya... ki.. ye user.. req ki body me kaisa aaya??
    // find user in db
    const user = await User.findById({ _id: id });
    // console.log("--->>lsakdjflask<---");
    // console.log(user);
    // validation

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // find profile
    await Profile.findByIdAndDelete({ _id: user.additionalDetails });
    // TODO: Unenroll User From All the Enrolled Courses
    // Now Delete User
    await User.findByIdAndDelete({ _id: id });


    // return response
    return res.status(200).json({
      success: true,
      message: `Profile deleted successfully`,
    })

  }
  catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully",error: error.message });
  }
}

// get user deltails
exports.getUserDetails = async (req, res) => {
  try {
    // get the id
    const id = req.user.id;
    // find the user and populate the profile

    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec(); // <-- hamare pass profile ki id thi.. aur hamne id ko poulate kiya

    // taki.. hame.. userki details mil jaye...  
    // return responce
    // console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails, // <-- ye userDetails me.. hamare pass.. user ki details ke sath sath profile ki details bhi aayegi
    });


  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


exports.updateDisplayPicture = async (req, res) => {
  try {

    const displayPicture = req.files.displayPicture
    console.log(`--->adslfkgasldkg<---`);
    console.log("Files received: ", req.files.displayPicture);

    // console.log(displayPicture);
    const userId = req.user.id
    const image = await uploadImagetoCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    // console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec()
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};