const express = require('express') 
const auth = require('../middleware/auth')
const router = express.Router() 
const Notification = require('../models/notifications')
const User = require('../models/user')
const mongoose = require('mongoose')

router.post('/notification', auth, async (req, res) => { 
    const user = req.user

    try {
        const notification = new Notification({
            ...req.body,
            sender: user._id, 
        })

        
        let receiver = await User.findById(notification.receiver)
        console.log(receiver)
        console.log(notification._id)
        receiver.notifications.push(notification._id)
        console.log(receiver)

        await receiver.save()

    

        await notification.save()

        res.status(201).send()
    }
    catch (error) {
        console.log(error)
        res.status(400).send()
    }
}) 

router.get('/notification/:id', auth, async (req, res) => {
    let userID = req.params.id
    let user
    
    if (!mongoose.isValidObjectId(userID)) {
      res.status(400).send("Invalid object id")
      return
    }
    try {
      user = await User.findById(userID)
      if (!user) {
        res.status(400).send('Invalid study group id')
        return
      }
    }
    catch (e) {
      console.log(e)
      res.status(500).send('Error finding study group')
      return
    }
  
    try {
      const notificationArray = user.notifications
      console.log(notificationArray)
      console.log(notificationArray[0])
      const results = []
      for(let i = 0; i < notificationArray.length; i++){
        results[i] = await Notification.findById(notificationArray[i])
      }
      
      console.log(results)
      res.send(results)
    } catch (e) {
      console.log(e)
      res.status(500).send()
    }
  
})  

module.exports = router