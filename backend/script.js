const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { v4: uuid } = require("uuid");
const multer = require("multer");

app.use(cors());
let file_limit = 1024 * 1024 * 1;
// upload file object
const upload = multer({
  storage: multer.diskStorage({
    // destination of file location
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },

    // specifing file name
    filename: (req, file, cb) => {
      let newFile = `${uuid()}-${file.originalname}`;
      cb(null, newFile);
    },
  }),

  // specifing file size as 5mb
  limits: {
    fileSize: file_limit,
  },

  // specify what file should accepts
  fileFilter: (req, file, cb) => {
    let acceptFiles = /jpg|jpeg|png|mp4|html/;
    let isAccepted = acceptFiles.test(path.extname(file.originalname));
    if (isAccepted) {
      return cb(null, true);
    } else {
      return cb(new Error("only accept jpg jpeg png file"), false);
    }
  },
});

app.post("/upload/post", upload.single("file"), (req, res) => {
  return res.json({
    data: req.file,
    message: "file uploaded succesfully",
  });
});

app.post("/upload/posts", upload.array("files"), (req, res) => {
  res.json({ data: req.files });
});

// middleware for handling error

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(500).json({
          error: "Error File is too large maximum file size should be 1mb",
        });
      default:
        return res.status(400).json({ error: err.message });
    }
  } else {
    return res.status(400).json({ error: err.message });
  }
});
app.listen(3000, () => console.log("running on 3000 port"));
