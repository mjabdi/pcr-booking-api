
const express = require('express');
const router = express.Router();
const {User} = require('./../../../models/medex/User')
const uuid = require('uuid-random')

router.post('/signin', async function(req, res, next) {
    
    try
    {
        let {username, password} = req.body

        username = username.trim().toLowerCase()

        const user = await User.findOne({username: username})
        if (!user)
        {
            res.status(200).send({status:'FAILED', error: 'Invalid username or password'})
            return  
        }

        if (!user.isActive)
        {
            res.status(200).send({status:'FAILED', error: 'Your account is not active yet, please check your email and follow the instructions to activate the account.'})
            return 
        }

        if (user.isLocked)
        {
            res.status(200).send({status:'FAILED', error: 'User is locked due to security issues, please contact administrator.'})
            return     
        }


        const isMatch = await user.comparePassword(password)
        if (!isMatch)
        {
            res.status(200).send({status:'FAILED', error: 'Invalid username or password'})
            return  
        }

        const authToken = user.authToken ? user.authToken : uuid()

        await User.updateOne({_id: user._id}, {authToken: authToken, lastLoginTimeStamp: new Date()})

        res.status(200).send({status: 'OK', token: authToken, roles: user.roles, isDoctor: user.isDoctor }) 
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
        const user = await User.findOne({authToken: token})
        if (!user)
        {
            res.status(200).send({status:'FAILED', error: 'INVALID-TOKEN'}) 
            return
        }

        res.status(200).send({status:'OK', userId: user.username, forename: user.forename, surname: user.surname, roles: user.roles, isDoctor: user.isDoctor, lastLoginTimeStamp: user.lastLoginTimeStamp})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})


router.post('/changepassword', async function(req, res, next) {

    try
    {
        let {username, newPassword} = req.body
        username = username.trim().toLowerCase()

        const user = await User.findOne({username: username})
        if (!user)
        {
            res.status(200).send({status:'FAILED', error: 'This email address is not registered in the system.'})
            return
        }

        user.password = newPassword

        await user.save()

        res.status(200).send({status:'OK'})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})

router.post('/signup', async function(req, res, next) {

    try
    {
        let { username, password, roles, isDoctor } = req.body;
        username = username.trim().toLowerCase()
        const found = await User.findOne({username: username})
        if (found)
        {
            res.status(200).send({status:'FAILED', error: 'This email username is already registered in the system'})
            return
        }

        const user = new User({
            timeStamp: new Date(),
            forename: '',
            surname: '',
            username: username,
            password: password,
            roles: roles,
            isDoctor: isDoctor,
            isActive: true
        }) 

        await user.save()

        res.status(201).send({status:'OK'})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})

module.exports = router