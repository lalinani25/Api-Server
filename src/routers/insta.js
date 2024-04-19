const express = require("express");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const User = require("../models/user");
const { IgApiClient } = require("instagram-private-api");

router.post("/user/insta-post", auth, async(req,res) =>{
    let user = req.user;
    let data = req.body;

    let result = await postToInsta(user.toJSON(), JSON.stringify(data));
    console.log(result)

    if(result === true){
        res.status(200).send("Instagram post creted!");
    }
    else{
        res.status(400).send("Unable to post to Instagram!");
    }
});

const postToInsta = async(user, data) => {
    data = JSON.parse(data);
    console.log(user.ig_username);
    console.log(user.ig_password);
    console.log(data.caption);
    console.log(data.image_url);

    try{
        const ig = new IgApiClient();
        ig.state.generateDevice(user.ig_username);
        await ig.account.login(user.ig_username,user.ig_password);

        const imageBuffer = await get({
            url: data.image_url,
            encoding: null,
        });

        await ig.publish.photo({
            file: imageBuffer,
            caption: data.caption,
        });

        return true;
    }
    catch(e){
        console.log("Unable to post to Instagram!");
    }

    return false;
}


router.patch("/user/insta", auth, async(req,res) =>{
    let user = req.user;
    let body = req.body;
    console.log(user);
    console.log(body);

    if(!mongoose.isValidObjectId(user._id)){
        res.status(400).send("Invalid request!");
        return;
    }

    console.log("User is valid!");

    try{
        console.log(user._id);
        let igUser = await User.findById(user._id);
        console.log(igUser);

        if(!igUser){
            res.status(400).send("User not found!");
            return;
        }

        igUser.ig_username = body.ig_username.toString();
        igUser.ig_password = body.ig_password.toString();

        console.log("ig username: " + igUser.ig_username);
        console.log("ig password: " + igUser.ig_password);

        await igUser.save();
        res.send("Instagram info updated!");
    }
    catch(e){
        res.status(400).send("Unable to add instagram info");
    }
});