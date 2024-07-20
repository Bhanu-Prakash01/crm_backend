const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Data = require('../models/data');
const { verifyToken } = require('../middlewares/isuser');
const jwt = require('jsonwebtoken');
const { verifyAdminToken } = require('../middlewares/isAdmin');



router.get("/",verifyAdminToken,async (req, res) => {
    const all_data = await Data.find();
    res.send(all_data)
});


router.post("/send",verifyToken, async (req, res) => {
    const {company_name, url,email,phone,handles} = req.body;
    const token = req.headers["authorization"];
    console.log(req.body);

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
        
    }catch(e){
        // console.error(e);
        res.status(400).send("Duplicate entry found");
    }
});


router.get("/get",verifyToken,async (req,res) => {
    const token = req.headers["authorization"];

    var uid =jwt.decode(token).id
    console.log(uid);
    const id_data = await Data.find({entered_by:uid});
    res.send(id_data);

});





module.exports = router;