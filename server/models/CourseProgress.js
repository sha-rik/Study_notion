const mongoose = require('mongoose');

// ye schema h
const courseProgress= new mongoose.Schema({
    courseID:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    completedVideos:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ],

})

// ye model h
module.exports= mongoose.model('CourseProgress',courseProgress)