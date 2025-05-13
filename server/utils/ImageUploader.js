const cloudinary = require('cloudinary').v2

exports.uploadImagetoCloudinary = async (file, folder, height, quality) =>{
    const options = {folder};
    if(height)
    {
        options.height= height;
    }
    if(quality)
    {
        options.quality=quality;
    }
    // ham height aur quality ke basis par... image ka size reduce kar sakte h....
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options); 
}