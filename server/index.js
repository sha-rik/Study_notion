const express = require('express');
const  fileUpload  = require('express-fileupload')// <--- file upload ka use ham koi si bhi file ko upload karne me karenge....
const app = express();

// we will make routes now
const userRoutes = require('./routes/User');
const paymentRoutes = require('./routes/Payment');
const profileRoutes = require('./routes/Profile');
const courseRoutes = require('./routes/Course');
const connectToDb = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // <-- ham chate h.. ki.. is macbook me.. 4000 par backend aur 3000 par front end..
// aur backendd entertin kare front end ko...
const { cloudinaryConnect } = require('./config/cloudinary');
require('dotenv').config();
PORT = process.env.PORT || 4000;

// database connection
connectToDb.connect();

// middleware connection
app.use(express.json()); // <-- ye middleware hai jo ki json data ko parse karne me madad karta hai...
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000", // <-- ye line ka mtlb h ... jo request localhost 3000 (frontend in our case) 
    // se aa rahi h... usko backend respoce karega
    credentials: true // <-- ye line ka mtlb h... ki jo bhi cookies h... wo frontend se backend me send ho payengi...
}))

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp',
    })
)

cloudinaryConnect();

// routes mount
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/course', courseRoutes);


app.get('/', (req, res) => {
    res.send(`API is running... ${PORT}`);
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
// alskfjl;sksdkl