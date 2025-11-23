/** @format */
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const userRouter = require("./routes/user.routes");
const indexRouter = require("./routes/index.routes");

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/", userRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
