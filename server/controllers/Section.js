const Section= require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
    try{
        // data fetch
        const { sectionName, courseId } = req.body;

        // validation
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}


        // create Section
        const newSection = await Section.create({sectionName});

        // jo section create hua h usko course me push karenge
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { new: true }
        )
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        // Return the updated course object in the response
        res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse,
        });
        // HW hame is updateed course details ko populate karna h... <-- abhi console.log karne par.. sirf id print hoga
        // aur .. ham to dekhna chate h.. pura coourse ka data...

        // const updatedCourseDetailsWithPopulate = await Course.findById(courseId).populate("courseContent");  <-- tis is given by Co-Pilot

        // return Respince


    }
    catch (error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:`something went wrong`,
        })
    }

}

exports.updateSection =  async (req,res) => {
    try{
        // data input...
        const {sectionName, sectionId} = req.body;
        // data validation

        if(!sectionName && !sectionId)
        {
            return res.status(401).json({
                success:false,
                message:`Either Section name or courseId is missing`,
            })
        }

        // update data
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        // return response

		res.status(200).json({
			success: true,
			message: section,
		});

    }
    catch (error)
    {
        console.log(error);
        return res.status(500).json({ 
            success:false,
            message:`something went during updateing section`, 
        })
    }
}

exports.deleteSection = async (req,res) =>{
    try
    {
        // get Id <--- we are assuming that we will get the id in the paramentres of request
        const { sectionId } = req.body;
        // now we will delete 
        await Section.findByIdAndDelete(sectionId);

		res.status(200).json({
			success: true,
			message: "Section deleted",
		});
    }
    catch(error)
    {
        console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
    }
}