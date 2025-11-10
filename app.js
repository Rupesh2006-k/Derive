/** @format */

const express = require("express");
const app = express();
const port = 3000;
let userRouter = require("./routes/user.routes");
app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.use("/user", userRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
