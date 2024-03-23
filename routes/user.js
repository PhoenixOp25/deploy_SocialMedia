const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin")
router.get("/user/:id", (req, res) => {
    USER.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            POST.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .then(posts => {
                    res.status(200).json({ user, posts });
                }).catch(err => {
                    console.log(err);
                    res.status(422).json({ error: "Error fetching posts" });
                });
        }).catch(err => {
            console.log(err);
            return res.status(404).json({ error: "User not found" });
        });
});


// to follow 
router.put("/follow", requireLogin, (req, res) => {
    // First, add the current user's id to the followId user's followers list
    USER.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, { new: true }).then(result1 => {
        // If the first update is successful, add the followId to the current user's following list
        USER.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true }).then(result2 => {
            // If both updates are successful, return the second update result
            res.json(result2);
        }).catch(err => {
            // If there's an error with the second update, return the error
            return res.status(422).json({ error: err });
        });
    }).catch(err => {
        // If there's an error with the first update, return the error
        return res.status(422).json({ error: err });
    });
});


//to unfollow
router.put("/unfollow", requireLogin, (req, res) => {
    // First, remove the current user's id from the followId user's followers list
    USER.findByIdAndUpdate(req.body.followId, {
        $pull: { followers: req.user._id }
    }, { new: true }).then(result1 => {
        // If the first update is successful, remove the followId from the current user's following list
        USER.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId }
        }, { new: true }).then(result2 => {
            // If both updates are successful, return the second update result
            res.json(result2);
        }).catch(err => {
            // If there's an error with the second update, return the error
            return res.status(422).json({ error: err });
        });
    }).catch(err => {
        // If there's an error with the first update, return the error
        return res.status(422).json({ error: err });
    });
});

//to upload pf
router.put("/uploadProfilePic",requireLogin,(req,res)=>{
    USER.findByIdAndUpdate(req.user._id,{
        $set:{Photo:req.body.pic}
    },{
        new:true
    })
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        return res.status(422).json({ error: err });
    })
})


module.exports=router;