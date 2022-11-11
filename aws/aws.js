//upload multi image to aws s3
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const AWS = require("aws-sdk");
let multer = require("multer");

const bucketName = "meta-unite-server"

const awsConfig = {
    accessKeyId: "AKIAQ6BK7WR56ICUKSEE",
        secretAccessKey: "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",
        region: "ap-south-1"
};

const S3 = new AWS.S3(awsConfig);

//const PORT = 3000;

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Specify the multer config
let upload = multer({
    // storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: function (req, file, done) {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg"
        ) {
            done(null, true);
        } else {
            //prevent the upload
            var newError = new Error("File type is incorrect");
            newError.name = "MulterError";
            done(newError, false);
        }
    },
});

//upload to s3
const uploadToS3 = (fileData) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: bucketName,
            Key: `${Date.now().toString()}.jpg`,
            Body: fileData,
        };
        S3.upload(params, (err, data) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            //console.log(data);
            
            return resolve(data.Location);
        });
    });
};

// //upload single image to s3
// app.post("/upload", upload.single("image"), async (req, res) => {
//     console.log(req.file);
//     if (req.file) {
//         await uploadToS3(req.file.buffer);
//     }

//     res.send({
//         msg: "Image uploaded succesfully",
//     });
// });

// //upload multiple images to s3
// app.post("/upload-multiple", upload.array("images", 8), async (req, res) => {
//     // console.log(req.files);

//     if (req.files && req.files.length > 0) {
//         for (var i = 0; i < req.files.length; i++) {
//             // console.log(req.files[i]);
//             await uploadToS3(req.files[i].buffer);
//         }
//     }

//     res.send({
//         msg: "Successfully uploaded " + req.files.length + " files!",
//     });
// });

module.exports = {uploadToS3};

//app.listen(PORT, () => console.log("server is running on " + PORT));