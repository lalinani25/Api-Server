const express = require('express') 
const auth = require('../middleware/auth')
const router = express.Router() 
const Notification = require('../models/notifications')

router.post('/notification', auth, async (req, res) => { 
    const user = req.user

    try {
        const notification = new Notification({
            ...req.body,
            sender: user._id
        })

        await notification.save()
        res.status(201).send()
    }
    catch (error) {
        console.log(error)
        res.status(400).send()
    }
}) 

module.exports = router