require('dotenv').config({ debug: true });

const express = require('express') 
require('./db/mongoose')
const cors = require('cors'); 
const userRouter = require('./routers/user') 
const studyGroupRouter = require('./routers/studyGroup') 
const notificationRouter = require('./routers/notification')

const app = express() 

app.use(cors()) 
app.use(function (req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
    next(); 
}); 

app.post('/fetch', async (req, res) => {
    const code = req.body.code
    console.log(code)
    if (code == 7) {
    res.send({
    message: "POST with body object"
    })
    }
    else if (code == 5) {
    res.status(401).send({
    message: "unauthorized: " + code
    })
    }
    else {
    res.status(400).send()
    }
   })
   
app.use(express.json()) 
app.use(userRouter) 
app.use(studyGroupRouter)
app.use(notificationRouter)

const port = process.env.PORT || 3000 
app.listen(port, () => { 
    console.log('Server is up on port ' + port) 
})