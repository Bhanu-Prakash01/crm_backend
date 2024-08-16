const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Data = require('../models/data');
const { verifyToken } = require('../middlewares/isuser');
const jwt = require('jsonwebtoken');
const { verifyAdminToken } = require('../middlewares/isAdmin');



router.get("/",async (req, res) => {
    const all_data = await Data.find();
    res.send(all_data)
});


router.get("/stats", async (req, res) => {
    try {
        const entries = await Data.aggregate([
            {
                $group: {
                    _id: {
                        user: "$entered_by",
                        date: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        }
                    },
                    count: { $sum: 1 }, // Count the number of records per day per user
                    records: { $push: "$$ROOT" } // Include the entire document in 'records'
                }
            },
            {
                $addFields: {
                    userId: { $toObjectId: "$_id.user" } // Convert entered_by to ObjectId
                }
            },
            {
                $lookup: {
                    from: "users", // Collection name of the users
                    localField: "userId",
                    foreignField: "_id",
                    as: "user_info"
                }
            },
            {
                $unwind: "$user_info" // Unwind the array to get the user object
            },
            {
                $project: {
                    userId: 1,
                    "user_info.username": 1, // Project only the username
                    count: 1,
                    records: 1,
                    "_id.date": 1
                }
            },
            {
                $sort: { "_id.date": 1 } // Sort by date
            }
        ]);

        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


router.post("/send", async (req, res) => {
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


router.get("/get",async (req,res) => {
    const token = req.headers["authorization"];

    var uid =jwt.decode(token).id
    console.log(uid);
    const id_data = await Data.find({entered_by:uid});
    res.send(id_data);

});





module.exports = router;