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

module.exports = router