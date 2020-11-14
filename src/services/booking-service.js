const express = require('express');
const router = express.Router();
const {Booking} = require('../models/Booking');
const dateformat = require('dateformat');
const getNewRef = require('./refgenatator-service');
const {sendConfirmationEmail, sendAntiBodyEmail} = require('./email-service');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/getnewreference', async function(req, res, next) {

    res.send({ref: await getNewRef()});

});

router.get('/getallbookings', async function(req, res, next) {

    try{
         const result = await Booking.find().sort({bookingDate: -1, bookingTimeNormalized: 1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/gettodaybookings', async function(req, res, next) {

    try{
        const today = dateformat(new Date(), 'yyyy-mm-dd');

         const result = await Booking.find({bookingDate : today}).sort({bookingTimeNormalized: 1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getoldbookings', async function(req, res, next) {

    try{
        const today = dateformat(new Date(), 'yyyy-mm-dd');

         const result = await Booking.find({bookingDate : {$lt : today}}).sort({bookingDate: -1, bookingTimeNormalized: 1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getfuturebookings', async function(req, res, next) {

    try{
        const today = dateformat(new Date(), 'yyyy-mm-dd');

         const result = await Booking.find({bookingDate : {$gt : today}}).sort({bookingDate: 1, bookingTimeNormalized: 1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getrecentbookings', async function(req, res, next) {

    try{
         const result = await Booking.find().sort({timeStamp: -1}).limit(5).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getrecentbookingsall', async function(req, res, next) {

    try{
         const result = await Booking.find().sort({timeStamp: -1}).limit(100).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.get('/getbookingsbyref', async function(req, res, next) {

    try{
         const result = await Booking.find({bookingRef : req.query.ref});
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/bookappointment', async function(req, res, next) {

    try
    {
        validateBookAppointment(req.body);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{
        const booking = new Booking(
            {
                ...req.body,
                timeStamp: new Date()
            }
        );

        await booking.save();
        
        await sendConfirmationEmail(req.body);

        if (req.body.antiBodyTest)
        {
            await sendAntiBodyEmail(req.body);
        }

        res.status(201).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.post('/updatebookappointment', async function(req, res, next) {

    try
    {
        req.body.bookingId = ObjectId(req.body.bookingId);
        validateBookAppointment(req.body.person);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

        await Booking.updateOne({_id : req.body.bookingId}, {...req.body.person});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

const validateBookAppointment = (body) => {

    if (!body.forename)
    {
        body.forename = body.firstname;
    } 
    if (!body.surname)
    {
        body.surname = body.lastname;
    } 

    console.log(body);

    if (!body.forename) 
    {    
        throw new Error('forename field not present');
    }

    if (!body.surname) 
    {
        throw new Error('surname field not present');
    }

    if (!body.title) 
    {
        throw new Error('title field not present');
    }

    if (!body.gender) 
    {
        throw new Error('gender field not present');
    }

    if (!body.email) 
    {
        throw new Error('email field not present');
    }

    if (!body.birthDate) 
    {
        throw new Error('birthDay field not present');
    }

    if (!body.phone) 
    {
        throw new Error('phone field not present');
    }

    if (!body.address) 
    {
        throw new Error('address field not present');
    }

    if (!body.postCode) 
    {
        throw new Error('postCode field not present');
    }

    if (!body.bookingDate) 
    {
        throw new Error('bookingDate field not present');
    }

    if (!body.bookingTime) 
    {
        throw new Error('bookingTime field not present');
    }

    if (!body.bookingRef) 
    {
        throw new Error('bookingRef field not present');
    }

    if (body.passportNumber2 && body.passportNumber2.trim().length === 0)
    {
        body.passportNumber2 = '';
    }

    body.bookingDate = dateformat(body.bookingDate, 'yyyy-mm-dd');
    body.birthDate = dateformat(body.birthDate, 'yyyy-mm-dd');
    body.bookingTimeNormalized = NormalizeTime(body.bookingTime);

    body.forenameCapital = body.forename.trim().toUpperCase();
    body.surnameCapital = body.surname.trim().toUpperCase();
   

    return true;
}

function NormalizeTime(str)
{
    var hour = parseInt(str.substr(0,2));
    const minutesStr = str.substr(3,2);
    const isPM = str.toLowerCase().indexOf('pm') > 0;

    if (isPM && hour < 12)
    {
        hour += 12;
    }

    if (!isPM && hour === 12)
    {
        hour = 0;
    }

    var hourStr = `${hour}`;
    if (hourStr.length < 2)
        hourStr = `0${hourStr}`;

    return `${hourStr}:${minutesStr}`;    
}


module.exports = router;
