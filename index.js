const express = require('express');
const mongoose = require('mongoose');
const auth = require("./routes/auth");
require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
app.use(morgan());
// Use the CORS middleware with a wildcard
const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
};

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
mongoose.set("strictQuery", false);
const data = require("./routes/data");





mongoose.connect("mongodb+srv://kingkite44:jRta1uw2EbufG5sl@cluster0.aogpmcg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
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