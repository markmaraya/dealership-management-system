var express = require("express");
var router = express.Router();
var multer = require("multer");
var Units = require("../models/Units.js");
var Gallery = require("../models/Gallery.js");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
});

var upload = multer({ storage: storage });

router.get("/:id", function (req, res, next) {
  Gallery.findById(req.params.id, function (err, gallery) {
    if (err) return next(err);
    res.json(gallery);
  });
});

router.post("/", upload.single("file"), async function (req, res, next) {
  try {
    if (!req.file) {
      return res.status(500).send({ message: "Upload fail" });
    }
    req.body.imageUrl = "/images/" + req.file.filename;
    const gallery = await Gallery.create(req.body);

    await Units.findByIdAndUpdate(
      req.body.unitCode,
      { imageFile: { _id: gallery._id, imageUrl: gallery.imageUrl } },
      { new: true },
    );

    res.json(gallery);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
