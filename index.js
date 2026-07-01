//app create karna
const express=require('express')
const app=express();

require('dotenv').config()

//port find karna
const PORT=process.env.PORT

//middleware add karna 

app.use(express.json())
const fileupload=require('express-fileupload')
app.use(fileupload(
     {useTempFiles:true,
    tempFileDir:'/tmp/',}
));

//db se connect karna

const dbConnect=require('./config/database');
dbConnect();

//cloud se connect

const {cloudinaryConnect}=require('./config/cloudinary');
cloudinaryConnect();

//route mount karna

const router=require('./routes/FileUpload')
app.use('/api/v1/',router);


app.listen(PORT,()=>{
    console.log("App started running successfuly");
})

app.get('/',(req,res)=>{
    res.send("dummy route")
})