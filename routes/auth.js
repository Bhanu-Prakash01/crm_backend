const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var salt = bcrypt.genSaltSync(10);
router.get("/", async (req, res)=>{
    res.send("all users");
})


router.get("/:id", async (req,res)=>{
    res.send("user by id");
});


router.post("/signup", async (req,res)=>{
    const {username,email,password,role} = req.body
    console.log(req.body)
    const hashpass = await bcrypt.hash(password, salt);
    console.log(hashpass)
    const user = new User({
        username:username,
        email:email,
        password: hashpass,
        role:role
    });

    try{
        const result = await user.save();
        res.send("Sucessfully signed up");
    }
    catch(err){
        console.log(err);
        res.status(400).send("ducplicate Entry Found");
    }
});

router.post("/signin", async (req,res)=>{
    // console.log(req.body);
    const user = await User.findOne({email: req.body.email});
    const pass_check=await bcrypt.compare( req.body.password,user.password)
    if(!user){
        res.send("Username does not exists")
        return;
    }
    if(!pass_check){
        res.send("Incorrect Password")
        return;
    }
    else{
        const token = jwt.sign({id: user._id,isadmin:user.isAdmin},"salt")
        res.json({token: token,name: user.username})
        return ;
    }
});

module.exports = router;