
const express = require('express');
const router = express.Router();
const {User} = require('./../models/User')
const {CreateRandomVerificationCode} = require('../verfication-code.js')
const uuid = require('uuid-random')
const {sendVerificationEmail, sendForgotPasswordEmail, sendWelcomeEmail} = require('./verification-email-service');
const { UserEmailMap } = require('../models/UserEmailMap');



const signupKeys = new Map()

const ForgotPasswordKeys = new Map()

const TIMEOUT = 10 * 60 * 1000

router.post('/signin', async function(req, res, next) {
    
    try
    {
        let {email, password} = req.body
        email = email.trim().toLowerCase()
        const user = await User.findOne({email: email})
        if (!user)
        {
            res.status(200).send({status:'FAILED', error: 'Invalid email-address or password, if you forgot your password please follow the Forgot-Password link in the below.'})
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
            res.status(200).send({status:'FAILED', error: 'Invalid username or password, '})
            return  
        }



        const authToken = user.authToken ? user.authToken : uuid()

        await User.updateOne({_id: user._id}, {authToken: authToken, lastLoginTimeStamp: new Date()})

        res.status(200).send({status: 'OK', token: authToken }) 
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

        res.status(200).send({status:'OK', userId: user.email, fullname: user.fullname})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})

router.post('/forgotpassword', async function(req, res, next) {

    try
    {
        let {email} = req.body
        email = email.trim().toLowerCase()
        const found = await User.findOne({email: email})
        if (!found)
        {
            res.status(200).send({status:'FAILED', error: 'This email address is not registered in the system.'})
            return
        }

        const verficationCode = CreateRandomVerificationCode()

        ForgotPasswordKeys.set(email, {verficationCode})
        setTimeout(() => {
            ForgotPasswordKeys.delete(email)
        }, TIMEOUT);

        await sendForgotPasswordEmail(email, found.fullname, verficationCode)

        res.status(200).send({status:'OK'})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})

router.post('/resetpassword', async function(req, res, next) {

    try
    {
        let {email, verficationCode, password} = req.body
        email = email.trim().toLowerCase()
        const user = await User.findOne({email: email})
        if (!user)
        {
            res.status(200).send({status:'FAILED', error: 'This email address is not registered in the system.'})
            return
        }

        const record = ForgotPasswordKeys.get(email)
        if (!record)
        {
            res.status(200).send({status:'FAILED', error: 'Verification Code has been expired! Please click the RESEND NEW CODE button to recieve the new code.'})
            return
        }

        if (record.verficationCode !== verficationCode)
        {
            res.status(200).send({status:'FAILED', error: 'Invalid Verification Code! Please try again.'})
            return
        }
    
        user.password = password

        await user.save()

        res.status(200).send({status:'OK'})
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
        const {token, password, newPassword} = req.body
        const user = await User.findOne({authToken: token})
        if (!user)
        {
            res.status(200).send({status:'FAILED', error: 'This email address is not registered in the system.'})
            return
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch)
        {
            res.status(200).send({status:'FAILED', error: 'Invalid Password - your current password is wrong!'})
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




router.post('/presignup', async function(req, res, next) {

    try
    {
        let {fullname , email, password} = req.body
        email = email.trim().toLowerCase()
        const found = await User.findOne({email: email})
        if (found)
        {
            res.status(200).send({status:'FAILED', error: 'This email address is already registered in the system, if you forgot your password please follow the Forgot-Password link in the Sign-in page.'})
            return
        }

        const verficationCode = CreateRandomVerificationCode()

        signupKeys.set(email, {verficationCode, fullname, password})
        setTimeout(() => {
            signupKeys.delete(email)
        }, TIMEOUT);

        await sendVerificationEmail(email, fullname, verficationCode)

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
        let {email, verficationCode} = req.body
        email = email.trim().toLowerCase()

        const found = await User.findOne({email: email})
        if (found)
        {
            res.status(200).send({status:'FAILED', error: 'This email address is already registered in the system, if you forgot your password please follow the Forgot-Password link in the Sign-in page.'})
            return
        }

        const record = signupKeys.get(email)
        if (!record)
        {
            res.status(200).send({status:'FAILED', error: 'Verification Code has been expired! Please click the RESEND NEW CODE button to recieve the new code.'})
            return
        }


        if (record.verficationCode !== verficationCode)
        {
            res.status(200).send({status:'FAILED', error: 'Invalid Verification Code! Please try again.'})
            return
        }
    
        const user = new User({
            timeStamp: new Date(),
            fullname: record.fullname,
            email: email,
            password: record.password,
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

router.post('/getusermapping', async function(req, res, next) {

    try
    {
        const {token} = req.body

        const usermap = await UserEmailMap.findOne({refNo: token})
        if (!usermap)
        {
            res.status(200).send({status:'FAILED', error: 'Sorry, your Sign-Up link is invalid! You can easily register with us through the Sign-Up page.'})
            return
        }

        const {email, fullname} = usermap

        const found = await User.findOne({email: email})
        if (found)
        {
            res.status(200).send({status:'FAILED', error: 'Your email address is already registered in the system, if you forgot your password please follow the Forgot-Password link in the Sign-in page.'})
            return
        }

        res.status(200).send({status:'OK', user: usermap})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})

router.post('/rapidsignup', async function(req, res, next) {

    try
    {
        const {token, password} = req.body

        const usermap = await UserEmailMap.findOne({refNo: token})
        if (!usermap)
        {
            res.status(200).send({status:'FAILED', error: 'Invalid Link'})
            return
        }

        const {email, fullname} = usermap

        const found = await User.findOne({email: email})
        if (found)
        {
            res.status(200).send({status:'FAILED', error: 'This email address is already registered in the system, if you forgot your password please follow the Forgot-Password link in the Sign-in page.'})
            return
        }

        const user = new User({
            timeStamp: new Date(),
            fullname: fullname,
            email: email,
            password: password,
            isActive: true
        }) 

        await user.save()

        const authToken = user.authToken ? user.authToken : uuid()

        await User.updateOne({_id: user._id}, {authToken: authToken, lastLoginTimeStamp: new Date()})

        await sendWelcomeEmail(email, fullname)


        res.status(200).send({status: 'OK', token: authToken }) 
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})


module.exports = router