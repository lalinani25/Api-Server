const auth = require('../middleware/auth')
const express = require('express')
const User = require('../models/user')
const { sendVerificationEmail } = require('../emails/account.js')
const mongoose = require("mongoose");
const router = new express.Router()
const { IgApiClient } = require("instagram-private-api");
const { get } = require("request-promise");
 

// Add a new user
router.post('/user', async (req, res) => {
 
  delete req.body.email_verified
  delete req.body.tokens  

  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()

    sendVerificationEmail(user.email, user.username, token)
    res.status(201).send(user)
  } 
  catch(error) {
    res.status(400).send(error)
  }
})

router.post('/user/login', async (req, res) => {
  try {
      console.log(req.body.email)
      console.log(req.body.password)

      const user = await User.findByCredentials(req.body.email, req.body.password)
      console.log(user)

      if (user.email_verified === true){
          const token = await user.generateAuthToken()
          res.status(200).send({ user, token })
      }
      else  { 
          res.status(401).send("Email has not been verified.") 
      }
  }
  catch (e) {
      console.log(e)
      res.status(500).send()
  }
})

router.patch('/user/logout', auth, async (req, res) => {
  const user = req.user

  try {
      user.tokens = user.tokens.filter((token) => {
          return token !== req.token
      })
      await user.save()

      res.send()
  }
  catch (e) {
      res.status(500).send()
  }
})

router.get('/user/verification', auth, async (req, res) => {
  const user = req.user
  const token = req.token

  console.log(user)
  console.log(token)

  user.email_verified = true
  user.save()
  
  res.send()
})

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
})


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
          encoding: null
      });  

      await ig.publish.photo({
          file: imageBuffer,
          caption: data.caption,
      });

      console.log(ig)

      return true;
  }
  catch(e){
      console.log("hello");
  }

  return false;
}




module.exports = router