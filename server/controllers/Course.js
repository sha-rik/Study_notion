const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImagetoCloudinary } = require("../utils/ImageUploader");
const { cloudinary } = require("../config/cloudinary");
require("dotenv").config();




exports.createCourse = async (req, res) => { // <--- ye req aa kahan se raha h.. smajh nahi aaya..
    try {
        // fetch data
        console.log(req.body);
        console.log("--->sfgjaojr<---");
        console.log(req.user);
        const userId = req.user.id; // ye user id ham is tarike se kion fetch kar rahe h...


        let { courseName, courseDescription, whatYouWillLearn, price, tag, category, status, instructions } = req.body;

        // fetch thumbnail
        const thumbnail = req.files.thumbnailImage;

        // validation
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag ||
            !thumbnail ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            });
        }

        if (!status || status === undefined) {
            status = "Draft";
        }
        // console.log(userId);

        // check for instructor
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        });

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            });
        }
        // TODO: verify that userID and instructorDetails._id are same or diffrent ?

        // YOUR instructorDetails KA VALIDATION IS NOT MENTIONED

        // check tags
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            });
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImagetoCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        );
        console.log(thumbnailImage);

        // now uploading to DB
        const newCourse = await Course.create({ // <--- ham kahi par... sirf courseName likh de rahe h... aur kahi par..
            // <--- whatYouWillLearn: whatYouWillLearn, is tarah se likh rahe h... 

            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions: instructions,

        })

        // updating the user db.. usme ham.. newly added course add kar rahe h
        await User.findByIdAndUpdate(
            {
                _id: instructorDetails._id,
            },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        // Add the new course to the Categories
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
        });


    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
}

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
            {},
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnroled: true,
            }
        )
            .populate("instructor")
            .exec();
        return res.status(200).json({
            success: true,
            data: allCourses,
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            message: `Can't Fetch Course Data`,
            error: error.message,
        });
    }
}

// ab course ki complete details find karenge...
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        

        const courseDetails = await Course.find({ _id: courseId })
        .populate(
            {
                path: "instructor",
                populate: {
                        path: "additionalDetails",
                    },
                }
            )
            .populate("category")
            .populate("ratingsAndReviews")
            .populate(
                {
                    path: "courseContent",
                    populate: {
                        path: "subSection"
                    },
                }
            )
            .exec();
        if (!courseDetails) {
            return res.status(400).json({
                message: `Could not find the course with course id --> ${courseId} `,
                success: false,
            })
        }
        console.log(courseDetails);
        return res.status(200).json({
            success: true,
            message: `course fetched successfully`,
            data: courseDetails,

        })
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            error: error.message,
        });
    }
}

