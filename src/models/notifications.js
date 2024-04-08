const mongoose = require('mongoose')

const validator = require('validator')

const NOTIFICATION_TYPE = require('./notification_type')

const Schema = mongoose.Schema

const notificationSchema = new Schema({ 

    sender:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true,
        lowercase: true,
    },
    receiver:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true,
        lowercase: true,
    },
    subject:{
        type:String,
        required: true,
    },
    body:{
        type:String,
        required: true,
    },
    isRead:{
        type:Boolean,
        required: false,
    },
    notification_type:{
        type:String,
        enum: NOTIFICATION_TYPE,
        required: false,
    },
    studygroup_id:{
        type: Schema.Types.ObjectId,
        ref: 'Studygroup',
        required: false,
    }

})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification