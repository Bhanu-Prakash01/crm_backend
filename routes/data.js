const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Data = require('../models/data');
const { verifyToken } = require('../middlewares/isuser');
const jwt = require('jsonwebtoken');

router.get("/",async (req, res) => {
    res.send("Welcome")
});


router.post("/send",verifyToken, async (req, res) => {
    const {company_name, url,email,phone,handles} = req.body;
    const token = req.headers["authorization"];


    var uid =jwt.decode(token).id
    const data = new Data({
        company_name,
        email,
        phone,
        handles,
        url,
        entered_by: uid
    });
    try{
        await data.save()
        res.send("Saved Successfully")
        
    }catch{
        res.status(400).send("Duplicate entry found");
    }
});




module.exports = router;