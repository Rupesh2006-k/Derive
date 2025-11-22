let mongoose = require("mongoose");

let connectDB = async () => {
  try {
    let res = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB 😎");
    return res;
  } catch (error) {
    console.log("Connection failed ❌", error.message);
    return error;
  }
};

module.exports = connectDB;
