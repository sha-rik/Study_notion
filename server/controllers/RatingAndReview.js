const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

// createRating
exports.createRating = async (req, res) => {
    try {
        // get user id
        const userId = req.user.id;
        // fetch from 
        const { rating, review, courseId } = req.body;
        // checking if user is enrolled or not     <--- ek new method se tumne check kar liya ... 
        const courseDetails = await Course.findOne(
            {
                _id: courseId, // <---  course ka id  se ,course find out kiya

                studentsEnrolled: { $elemMatch: { $eq: userId } }, // <-- ab, ek course ke andar to bahut sare user ho sakte h
                // <-- to usme ham sabse main user ko find out kar rahe h
            });
        if (!courseDetails) {
            return res.status(401).json({
                success: true,
                message: `Student is not enrolled`,
            });
        }

        // now checking if user is already reviewd.
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course:courseId,
        })

        if(alreadyReviewed){
            return res.status(401).json({
                success: false,
                message: `User has already reviewed`,
            });
        }
        
        // create a new rating and review
        const RatingAndReview = await RatingAndReview.create({
            rating,
            review,
            user: userId,
            course: courseId,
        });

        // update the course rating in course model
        const updatedCourseDetails =await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    ratingsAndReviews : RatingAndReview._id, // <--  ye rating and review ka id hai jo abhi abhi create kiya hai
                }
            },
            {new:true});

        console.log(updatedCourseDetails);

        // return response
        return res.status(200).json({
            success: true,
            message: `Rating and review created successfully`,
            RatingAndReview,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal server error while doing rating and review`,
            error: error.message,
        });

    }
}

// getAverageRating

exports.getAverageRating = async (req,res) => {
    try
    {
        // get the course ka id
        const {courseId} = req.body;
        // calulate the average rating <---tumne yahan ek similar to SQL statement use kiya h...
        const result = await RatingAndReview.aggregate([
            {
                $match: { // <-- is method ka mtlb hota h ki... hame aishi entry find out kar ke do...
                            // course ke field me se couseId ka id ho
                    course: new mongoose.Types.ObjectId(courseId), // <-- courseid string thi.. hamen uso object me chage kar diya
                },
            },
            {
                $group: { //<--ab hamne group kar liya.. taki.. ham group kar sake... 
                    _id: NULL,
                    averageRating: { $avg: "$rating" }, //<-- hamen is tarah se avg rating nikaal liya..

                }
            }
        ]);

        // return rating
        if(result.length >0)
        {
            return res.status(200).json({
                status:true,
                averageRating: result[0].averageRating, //<-- hamne is tarah se average rating pass kar di h... responce me
            })
        }

        return res.status(200).json({
            success:true,
            message:`Average rating is 0 , no rating given till now`,
            averageRating:0,
        })
        
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).json({
            sucess:false,
            message:error.message,
        })
    }
}


// getAllRating

exports.getAllRating= async (req,res) => {
    try{
        const allReviews= await RatingAndReview.find({})
        .sort({rating:"desc"})
        .populate({
            path:"user", // <-- Rating and Review ke model me jaake tum.. user wale path me jao
            select:"firstName lastname"            // <--- aur fir sirf ye sari chijien lake hamko do
        })
        .populate({
            path:"course",
            select:"courseName",
        })
        .exec();
        return res.status(500).json({
            success:true,
            message:`All reviews fethched successfully`,
            details:allReviews,
        });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            sucess:false,
            message:error.message,
        })
    }
}
