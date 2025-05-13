const mongoose = require('mongoose')
require('dotenv').config()

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Database connection successful")
    })
    .catch((err)=>{
        console.log("Connection Failed")
        console.err(err)
        process.exit(1)
    })

}



// const mongoose =require('mongoose');
// require('dotenv').config();

// exports.connect =()=>
// {
//     mongoose.connect(process.env.MONGODB_URL)
//     .then(()=>{
//         console.log('Database connected');
//     })
//     .catch((err) =>
//     {
//         console.log("DB connection failed")
//         console.error(err)
//         process.exit(1)
//     })
// }

