const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST=mongoose.model("POST")
// routes
router.get("/allposts",requireLogin,(req,res)=>{
    POST.find()
    .populate("postedBy","_id name Photo")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then(posts=>res.json(posts))
    .catch(err=>console.log(err))
})


router.post("/createPost",requireLogin ,(req, res) => {
    const { body,pic } = req.body;
    if (!pic || !body) {
        return res.status(422).json({ error: "please add all fields" });
    }
    req.user
    const post=new POST({
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then((result)=>{
        return res.json({post:result})
    }).catch(err=>console.log(err))
});
router.get("/myposts",requireLogin,(req,res)=>{
    POST.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then(myposts=>{
        res.json(myposts)
    })
})
//put-to update fiels
//we use exec funtion when we update something, works same as normal callback, but is preffered
router.put("/like",requireLogin,(req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).populate("postedBy","_id name Photo")
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        return res.status(422).json({ error: err });
    });
})

router.put("/unlike",requireLogin,(req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).populate("postedBy","_id name Photo")
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        return res.status(422).json({ error: err });
    });
})

router.put("/comment", requireLogin, (req, res) => {
    const comment = {
        comment: req.body.text, // Assuming the schema key is 'text'. Adjust according to your schema.
        postedBy: req.user._id
    };

    POST.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment}
    }, {
        new: true,
        // Optionally use `populate` here if you want to populate data of `postedBy` in the response
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name Photo")
    .then(result => {
        res.json(result); // Successfully send back the updated document
    }).catch(err => {
        res.status(422).json({error: err}); // Handle any errors that occur during the update
    });
});
//api to del post



router.delete("/deletePost/:postId", requireLogin, (req, res) => {
    POST.findById(req.params.postId)
        .populate("postedBy", "_id")
        .then(post => {
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                // Use findByIdAndDelete to remove the post
                POST.findByIdAndDelete(req.params.postId)
                    .then(result => {
                        res.json({ message: "Successfully deleted" });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "Could not delete the post" });
                    });
            } else {
                return res.status(401).json({ error: "You are not authorized to perform this action" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Internal server error" });
        });
});

//to show post of which i follw

router.get("/myfollowingpost",requireLogin,(req,res)=>{
    POST.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("postedBy","_id name Photo")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json(posts)
    })
    .catch(err=>{console.log(err)})

})

module.exports = router;
