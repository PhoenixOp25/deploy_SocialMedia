const express = require("express");
const app = express();
const PORT = process.env.port || 5000;
const cors = require("cors");
const { mongoUrl } = require("./key.js");
const mongoose = require("mongoose");

const path=require("path")
// Ensure mongoUrl is a string
//console.log(typeof mongoUrl); // Debug: Check the type of mongoUrl
// Initialize models
require("./models/post.js");
require("./models/model.js");

//app.use for middle ware function
// Middleware
app.use(cors()); // Use CORS middleware for cross-origin requests
app.use(express.json()); // Use JSON parsing middleware
// Routes
app.use(require("./routes/createPost.js"));
app.use(require("./routes/auth.js"));
 app.use(require("./routes/user.js"));
// Connect to MongoDB
mongoose.connect(mongoUrl);

mongoose.connection.on("connected", () => {
    console.log("successfully connected to mongo");
});

mongoose.connection.on("error", (err) => {
    console.log("not successfully connected to mongo", err);
});


//serving fontend
app.use(express.static(path.join(__dirname, "./frontend/build")))

app.get("*",(req,res)=>{
    res.sendFile(
        path.join(__dirname,"./frontend/build/index.html"),
        function(err){
            res.status(500).send(err)
        }
    )
})

// Start the server
app.listen(PORT, () => {
    console.log("server running on 5k");
});