// sabse phele instance lenge ham
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

// ham payment capture karenge
exports.capturePayment = async (req, res) => {

    // req ki body se details... <-- ki koon sa course kisko chahiye
    const { course_id } = req.body;
    const userId = req.user.id;

    // validations perform karnge
    if (!course_id) {
        return res.json({
            success: false,
            message: 'Please provide valid course ID',
        })
    };

    // valid course id  hona chahiye... valid course details hona chahiye....
    let course;
    try {
        course = await Course.findById(course_id);
        if (!course) {
            return res.json({
                success: false,
                message: 'Could not find the course',
            });
        }


        // user phele se  course ko buy kiya hua nahi hona nahi chaiye... <-- par ye kasie karenge...
        //   <-- tumne course ke modle me..studentsEnrolled naam ka filed banaya h
        //   <-- isse tum pata kar sakte ho. ki kya ye student phele se hi.. enroll kiya hua h ki nahi
        //   <-- so we will do  userId === course.studentsEnrolled...
        // but... userId --> string and course.studentsEnrolled --> array of objectId.. isko change karna hoga



        const uid = new mongoose.Types.ObjectId(userId);  // <-- ye tumhe string ko objectId me convert karne me help karega
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: 'Student is already enrolled',
            });
        }
    }
    catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }




    // ab order create karo...
    const amount = course.price; // <-- ye amount hoga jo tumhe pay karna hoga
    const currency = 'INR'; // <-- ye currency hoga jo tumhe pay karna hoga
    const options = {
        amount: amount * 100,
        currency: currency,
        receipt: Math.random(Date.now()).toString(), // <-- ye tumhe receipt ka naam dena hoga
        notes: {
            courseId: course_id,
            userId: userId,
        }
    };

    try {

        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);  // <-- ye tumhe order create karne me help karega
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }

};

exports.verifySignature = async (req, res) => { // hama yahan signature match kar rahe h...
    const webhookSecret = "12345678";
    const signature = req.headers["x-razorpay-signature"]; // <-- hamne  
    // razor pay ne ye secret key hash karke send ki h...
    // ham HMAC ka use karenge... to hash our signature


    // -------------------- X X X X X --------------------------- HASHING FUNCTION -------------------- X X X X X ---------------------------//
    const shasum =  crypto.createHmac("sha256", webhookSecret);  // <-- hashing ke output ko ham digest ke naam se bulate h
    shasum.update(JSON.stringify(req.body)); // hmane isko string format me convert kardiya
    const digest = shasum.digest("hex"); // <-- ab hamne hexa decimal format me convert kar diya
    // -------------------- X X X X X --------------------------- HASHING FUNCTION -------------------- X X X X X ---------------------------//

    if (digest === signature) {
        console.log("Payment is Authorised"); //<--- yahan tak to sab thik tha... par ab... payment hone ke baad hame student ko enroll karna h

        // par.. ye wala function to... frontend se nahi aa raha h... ye to razor pay se aaya h... 
        // to ab course ki id aur user ki id kahan se mile...

        const {courseId, userId} = req.body.payload.payment.entity.notes; // <-- ye tumhe notes se milega

        try {
            // find the course and enroll in it

            // -------------------- P P P P P --------------------------- COURSE KE ANDAR UPDATE -------------------- P P P P P ---------------------------//
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } }, // <-- ye tumhe course me student ko enroll karne me help karega
                { new: true }
            );

            
            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: 'Course not Found',
                });
            }

            console.log(enrolledCourse);

            // -------------------- P P P P P --------------------------- COURSE KE ANDAR UPDATE -------------------- P P P P P ---------------------------//

            // -------------------- Q Q Q Q Q --------------------- STUDENT KE ANDAR HAMNE COURSE BHI DAAL DIYA -------------------- Q Q Q Q Q ---------------------------//

            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { courses: courseId } }, // <-- ye tumhe student me course ko enroll karne me help karega
                { new: true }
            );

            console.log(enrolledStudent);


            // -------------------- Q Q Q Q Q --------------------- STUDENT KE ANDAR HAMNE COURSE BHI DAAL DIYA -------------------- Q Q Q Q Q ---------------------------//

            // mail send karna hoga ab
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulations from CodeHelp",
                "Congratulations, you are onboarded into new CodeHelp Course",
            );


            console.log(emailResponse);
            return res.status(200).json({
                success: true,
                message: `Course enrolled successfully`,
                courseName: enrolledCourse.courseName,
                courseDescription: enrolledCourse.courseDescription,
                courseThumbnail: enrolledCourse.thumbnail,
                courseId: enrolledCourse._id,
                studentName: enrolledStudent.name,
            });

        }
        catch (error) {
            console.log(error);
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }



    }
    else {
        console.log("Signature not matched");
        return res.status(401).json({
            success: false,
            message: `Invalid Input`,
        });
    }





}