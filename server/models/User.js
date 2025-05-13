const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName:
    {
        type: String,
        require: true,
        trim: true
    },
    email:
    {
        type: String,
        required: false,
        trim: true
    },
    password:
    {
        type: String,
        required: true
    },
    accountType:
    {
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        require: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails:
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Profile",
        require: true
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }
    ],
    image:
    {
        type: String,
        required: true,
    },
    token:
    {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courseProgress",
        },
    ],

},
    { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);

// exports.User = mongoose.model('User', userSchema)