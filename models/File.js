const mongoose = require('mongoose');
const nodemailer = require('nodemailer')

require('dotenv').config();

const fileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        tags: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        }
    }
)

//Sending a confirmation mail after document is created on File DB

fileSchema.post("save", async (doc) => {
    try {
        console.log("Doc", doc)

        //creating transporter
        const transporter = nodemailer.createTransport(
            {
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            }
        )

        //send mail

        let info = transporter.sendMail(
            {
                from: "Code Help",
                to: doc.email,
                subject: "File Uploaded to Cloudinary",
                html: `<h,>Hello Jee </h1>
                <p> File Uploaded See it here ${doc.secure_url}</p>`
            }
        )

        console.log(info);
    }
    catch (err) {
        console.error(err);
    }

})

module.exports = mongoose.model("File", fileSchema);