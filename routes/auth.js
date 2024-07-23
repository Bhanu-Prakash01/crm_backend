const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var salt = bcrypt.genSaltSync(10);
router.get("/", async (req, res)=>{
    res.send("all users");
})


// router.get("/:id", async (req,res)=>{
//     res.send("user by id");
// });


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


router.post("/task_update", async (req, res) => {
    const {task,email} = req.body;
    const data = await User.findOneAndUpdate({email: email},{
        $set: {
            task: task
        }
    });

});
router.get("/task", async (req, res) => {
    // const user = await User.findById(req.params.id);
    // if (!user) {
    //     return res.status(404).json({ message: "User not found" });
    // }
    // res.send(user);
    const token = req.headers["authorization"];

    var uid =jwt.decode(token).id
    // res.send(uid);
    const data = await User.findById(uid);
    res.send(data.task);
});

router.post("/signin", async (req,res)=>{
    // console.log(req.body);
    const user = await User.findOne({email: req.body.email});
    if(!user){
        res.status(401).send("Username does not exists")
        return;
    }
    const pass_check=await bcrypt.compare( req.body.password,user.password)

    if(!pass_check){
        res.status(400).send("Incorrect Password")
        return;
    }
    else{
        const token = jwt.sign({id: user._id,isadmin:user.isAdmin},"salt")
        res.json({token: token,name: user.username})
        return ;
    }
});

module.exports = router;