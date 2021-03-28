
const express = require('express');
const router = express.Router();
const uuid = require('uuid-random')

router.post('/signin', async function(req, res, next) {
    
    try
    {
        let {username, password} = req.body

        username = username.trim().toLowerCase()

        const isMatch = (username.toLowerCase() === 'admin' && password === 'ov$2021')
                        || (username.toLowerCase() === 'ovadmin' && password === 'vision$2021')
        if (!isMatch)
        {
            res.status(200).send({status:'FAILED', error: 'Invalid username or password'})
            return  
        }

        const authToken = uuid()

        res.status(200).send({status: 'OK', token: authToken, roles: ["ovadmin"] }) 
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})

router.post('/checktoken', async function(req, res, next) {
    try{
        const {token} = req.body
        res.status(200).send({status:'OK', userId: "admin", forename: "admin", surname: "", roles:  ["ovadmin"] , lastLoginTimeStamp: new Date()})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})



module.exports = router