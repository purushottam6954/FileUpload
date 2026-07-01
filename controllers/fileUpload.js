const File = require('../models/File');
const cloudinary = require('cloudinary').v2;

//localFileupload handler function
exports.localFileUpload = async (req, res) => {

    try {

        // const file = req.files.file
        // console.log("File AAGYI JEE----->", file)
        // const path=__dirname+'/files/'+Date.now()+`.${file.name.split('.')[1]}`

        // file.mv(path,(err)=>{
        //     console.error(err);
        // })

        //file ko fetch karo request se 
        const { file } = req.files;
        console.log(req.files)
        const extension = file.name.split('.')[1];

        //kaha save karenge wo declare karo
        const path = __dirname + "/file/" + "new_image" + "." + extension;


        //ab file ko move karenge
        file.mv(path, (err) => {
            console.error(err)
        })

        res.json({
            success: true,
            message: "file uploaded successfully"
        })
    } catch (err) {
        console.error(err);
    }


}
let isSupportedType = (fileType, supportedTypes) => {
    return supportedTypes.includes(fileType)
}

async function uploadFileToCloudinary(file, folder) {
    const options = {
        folder,
        resource_type:"auto"
    }
    return await cloudinary.uploader.upload(file.tempFilePath, options)

}

exports.imageUpload = async (req, res) => {

    try {

        const { name, email, tags } = req.body;
        const file = req.files.imageFile;

        const supportedTypes = ["jpg", "jpeg", "png"];

        const fileType = file.name.split('.')[1].toLowerCase();

        //validation run karenge 

        if (!isSupportedType(fileType, supportedTypes)) {

            return res.status(400).json({
                success: false,
                message: "File type not supported"
            })
        }

        const response = await uploadFileToCloudinary(file, "babbar");
        console.log(response);

        const fileData = await File.create({
            name,
            email,
            tags,
            imageUrl: response.secure_url
        })
        res.status(200).json(
            {
                success: true,
                message: "image file uploaded successfully"
            }
        )

    } catch (err) {

        console.error(err);
        res.status(400).json(
            {
                success: false,
                message: "Some error occured"
            }
        )
    }
}

exports.videoUpload = async (req, res) => {

    try {

        const {name, email, tags}=req.body;

        const videoFile=req.files.videoFile;
        console.log(videoFile);
        const fileType=videoFile.name.split('.')[1].toLowerCase();

        const supportedTypes=["mp4", "mov"];

        if(!isSupportedType(fileType,supportedTypes)){
            return res.status(400).json(
                {
                    success:false,
                    message:"unsupported file format"
                }
            )
        }

        const response=await uploadFileToCloudinary(videoFile,"babbar");
        console.log(response);

        //DB mein entry create

        const entryInDb=await File.create({
            email,name,tags,
            imageUrl:response.secure_url
        })

        return res.status(200).json(
            {
                succdess:true,
                message:"Video successfully uploaded"
            }
        )


        

    }
    catch (err) {

        console.error(err);
        return res.status(400).json(
            {
                success: false,
                videoUrl:response.secure_url,
                message: "Some error occured"
            }
        )
    }
}