const express = require('express');
const mongoose = require('mongoose');
const auth = require("./routes/auth");
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
mongoose.set("strictQuery", false);
const data = require("./routes/data");





mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
 .then(() => console.log("MongoDB Connected"))
 .catch(err => console.log(err))




app.use("/users",auth)
app.use("/data",data)



app.get("/",(req,res)=>{
    res.send("Welcome to our API!");
})


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});