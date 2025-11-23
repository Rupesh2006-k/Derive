var mongoose = require("mongoose");

let fileSchema = mongoose.Schema({
  originalName: {
    type: String,
    required: [true, "originalName is required"],
  },
  url: {
    type: String,
    required: [true, "Cloudinary URL is required"],
  },
  mimetype: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "user is required"],
  },
});

let fileModel = mongoose.model("file", fileSchema);
module.exports = fileModel;
