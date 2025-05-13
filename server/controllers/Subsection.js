const Subsection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadImagetoCloudinary} = require('../utils/ImageUploader');
require('dotenv').config();

// subsection crate karna..
exports.createSubsection = async (req, res) => {
  try {
    // fetch data...{title, timeDuration, description}
    const { sectionId, title, timeDuration, description } = req.body;
    // par... video kahan se milega.. to uske liye karo... file se extract
    const video = req.files.videoFile;
    //  validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" });
    }
    // ab... hame to url dalna h subsetivon me.... aur URL kahan se aayega --> cloudinary me upload karo
    const uploadDetails = await uploadImagetoCloudinary(
      video,
      process.env.FOLDER_NAME
    );


    //  now create a subsection
    const SubSectionDetails = await Subsection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    //  aur... as we have taken refrence of subsection of... in section...to fir
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    // HW: log updated section here...mtlb.. isko populate karo.. taki sara data show ho
    // subsection ki id ko... section me dalo...
    return res.status(200).json({ success: true, data: updatedSection });
  }
  catch (error) {
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// update karna...

// ye HW tha.. par tumne copy paste kiya...
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body
    const subSection = await SubSection.findById(sectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImagetoCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    return res.json({
      success: true,
      message: "Section updated successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

// delete karna...

// ye bhi HW tha par tumne copy paste kiya..
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}

// ye dono HW h...
