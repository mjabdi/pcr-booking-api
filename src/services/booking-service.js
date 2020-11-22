const express = require('express');
const router = express.Router();
const {Booking} = require('../models/Booking');
const {Link} = require('../models/link');
const dateformat = require('dateformat');
const getNewRef = require('./refgenatator-service');
const {sendConfirmationEmail, sendAntiBodyEmail} = require('./email-service');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const stringSimilarity = require('string-similarity');
const {GlobalParams} = require('./../models/GlobalParams');


router.post('/resendemails' , async function (req,res,next) {

    try{
        const id = ObjectId(req.query.id);
        await Link.updateOne({_id: id} , {status: 'downloadFailed'});
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.post('/matchrecords', async function (req,res,next) {

    try{
        const bookingId = ObjectId(req.query.bookingid);
        const linkId = ObjectId(req.query.linkid);
    
    
        var extRef = '';
        const booking = await Booking.findOne({_id : bookingId});
    
        if (!booking.extRef || booking.extRef === 'not-set')
        {
            const params = await GlobalParams.findOne({name:'parameters'});
            extRef = `MX${params.lastExtRef + 1}`;
            await GlobalParams.updateOne({name:'parameters'}, {lastExtRef : params.lastExtRef + 1});
            await Booking.updateOne({_id: bookingId} , {extRef : extRef});
        }else
        {
            extRef = booking.extRef;
        }
    
        await Link.updateOne({_id: linkId}, {extRef : extRef});
    
        res.status(200).send({status : "OK"});
    }
    catch(err){
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getunmatchedrecords', async function(req, res, next) {

    try{
         const result = await Link.find({isPCR: true, emailNotFound: true, seen : {$ne : true }, testDate: {$gt : '2020-11-12'}}).sort({timeStamp: -1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getunmatchedrecordsarchived', async function(req, res, next) {

    try{
         const result = await Link.find({isPCR: true, emailNotFound: true, seen : {$eq : true }, testDate: {$gt : '2020-11-12'}}).sort({timeStamp: -1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/archiverecord', async function(req, res, next) {

    try{
         const id = ObjectId(req.query.id);
         console.log(id);
         const result = await Link.updateOne({_id: id}, {seen : true});
         console.log(result);
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/unarchiverecord', async function(req, res, next) {

    try{
         const id = ObjectId(req.query.id);
         console.log(id);
         const result = await Link.updateOne({_id: id}, {seen : false});
         console.log(result);
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.get('/getnewreference', async function(req, res, next) {

    res.send({ref: await getNewRef()});

});

router.get('/getallbookings', async function(req, res, next) {

    try{
         const result = await Booking.find( {deleted : {$ne : true }} ).sort({bookingDate: -1, bookingTimeNormalized: -1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getdeletedbookings', async function(req, res, next) {

    try{
         const result = await Booking.find( {deleted : {$eq : true }} ).sort({bookingDate: -1, bookingTimeNormalized: -1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getlivebookings', async function(req, res, next) {

    try{
         const result = await Booking.find({status: 'sample_taken' , deleted : {$ne : true }}).sort({bookingDate: -1, bookingTimeNormalized: -1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getpositivebookings', async function(req, res, next) {

    try{
         const result = await Booking.find({status: 'positive' , deleted : {$ne : true }}).sort({bookingDate: -1, bookingTimeNormalized: -1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getcompletedbookings', async function(req, res, next) {

    try{
         const result = await Booking.find({ $or: [{status: 'report_sent', deleted : {$ne : true }}, {status: 'report_cert_sent', deleted : {$ne : true }}]}).sort({bookingDate: -1, bookingTimeNormalized: -1}).exec();
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

         const result = await Booking.find({bookingDate : today, deleted : {$ne : true }}).sort({bookingTimeNormalized: 1}).exec();
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

         const result = await Booking.find({bookingDate : {$lt : today}, deleted : {$ne : true }}).sort({bookingDate: -1, bookingTimeNormalized: -1}).exec();
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

         const result = await Booking.find({bookingDate : {$gt : today}, deleted : {$ne : true }}).sort({bookingDate: 1, bookingTimeNormalized: 1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getrecentbookings', async function(req, res, next) {

    try{
         const result = await Booking.find({deleted : {$ne : true }}).sort({timeStamp: -1}).limit(5).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getrecentbookingsall', async function(req, res, next) {

    try{
         const result = await Booking.find({deleted : {$ne : true }}).sort({timeStamp: -1}).exec();
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

router.get('/getbookingbyid', async function(req, res, next) {

    try{
        req.query.id = ObjectId(req.query.id);
         const result = await Booking.findOne({_id : req.query.id});
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getbookingsbyrefandbirthdate', async function(req, res, next) {

    try{
         const result = await Booking.findOne({bookingRef : req.query.ref, birthDate : req.query.birthdate, deleted : {$ne : true }});
         if (result)
         {
            if (result.status !== 'booked' || timePassed(result.bookingDate))
            {
                res.status(200).send({status:'FAILED' , error : 'Time Passed'});

            }else
            {
                res.status(200).send({status:'OK' , booking : result});
            }
         }
         else
         {
            res.status(200).send({status:'FAILED' , error : 'Not Found'});
         }
        
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

        const found = await Booking.findOne({forenameCapital : req.body.forenameCapital,
                                         surnameCapital: req.body.surnameCapital, 
                                         birthDate: req.body.birthDate, 
                                         bookingDate: req.body.bookingDate});

        if (found)
        {
            res.status(200).send({status:'FAILED' , error: 'Repeated Booking!', person: req.body});
            return;
        }

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

        res.status(201).send({status: 'OK', person: req.body});

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

        const oldBooking = await Booking.findOne({_id : req.body.bookingId});

        await Booking.updateOne({_id : req.body.bookingId}, {...req.body.person});

        await sendConfirmationEmail(req.body.person);

        if (req.body.person.antiBodyTest && !oldBooking.antiBodyTest)
        {
            await sendAntiBodyEmail(req.body.person);
        }

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.post('/updatebookappointmenttime', async function(req, res, next) {

    try
    {
        req.body.bookingId = ObjectId(req.body.bookingId);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

        await Booking.updateOne({_id : req.body.bookingId}, {bookingDate : req.body.bookingDate, bookingTime : req.body.bookingTime});

        const booking = await Booking.findOne({_id : req.body.bookingId});

        await sendConfirmationEmail(booking);

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});


router.post('/deletebookappointment', async function(req, res, next) {

    try
    {
        req.query.id = ObjectId(req.query.id);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

        await Booking.updateOne({_id : req.query.id}, {deleted : true});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.post('/undeletebookappointment', async function(req, res, next) {

    try
    {
        req.query.id = ObjectId(req.query.id);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

        await Booking.updateOne({_id : req.query.id}, {deleted : false});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.get('/getlinkdetails', async function(req, res, next) {

    try
    {
        req.query.id = ObjectId(req.query.id);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{
         const result = await Link.findOne({_id: req.query.id});
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getbestmatchedbookings', async function(req, res, next) {

    try
    {
        req.query.id = ObjectId(req.query.id);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

        const link =  await Link.findOne({_id : req.query.id});

        const liveRecords = await Booking.find({status : 'sample_taken', deleted : {$ne : true }});

        const forenameArray = [];
        const surnameArray = [];
        const fullNameArray = [];
    
        if (liveRecords && liveRecords.length > 0)
        {
            for (var i = 0 ; i < liveRecords.length; i++)
            {
                forenameArray.push(liveRecords[i].forenameCapital);
                surnameArray.push(liveRecords[i].surnameCapital);
                fullNameArray.push(`${liveRecords[i].forenameCapital} ${liveRecords[i].surnameCapital}`);
            }
        }
    
        const fullname = `${link.forename} ${link.surname}`;
        const matchedFullnameIndex =  stringSimilarity.findBestMatch(fullname, fullNameArray).bestMatchIndex;
        const likelihood = stringSimilarity.findBestMatch(fullname, fullNameArray).bestMatch.rating.toFixed(2);
    
        const matchedForename = forenameArray[matchedFullnameIndex];
        const matchedSurname = surnameArray[matchedFullnameIndex];
        var bookingMatch = [];
    

        bookingMatch.push({likelihood: likelihood, bookings: await Booking.find({forenameCapital : matchedForename, surnameCapital : matchedSurname, deleted : {$ne : true }})});
        bookingMatch.push({likelihood: likelihood * 0.95, bookings: await Booking.find({forenameCapital : matchedSurname , surnameCapital : matchedForename, deleted : {$ne : true }})});
        bookingMatch.push({likelihood: likelihood * 0.8, bookings: await Booking.find({surnameCapital : matchedSurname, deleted : {$ne : true }})});
        bookingMatch.push({likelihood: likelihood * 0.6, bookings: await Booking.find({forenameCapital : matchedForename, deleted : {$ne : true }})});
        bookingMatch.push({likelihood: likelihood * 0.5, bookings: await Booking.find({forenameCapital : matchedSurname, deleted : {$ne : true }})});
        bookingMatch.push({likelihood: likelihood * 0.5, bookings: await Booking.find({surnameCapital : matchedForename, deleted : {$ne : true }})});
    
        const result = [];
    
        bookingMatch.forEach(group => {
            if (group.bookings.length > 0 && group.likelihood > 0.5)
            {
                group.bookings.forEach(booking => {
                    if (result.findIndex(element => `${element._id}` === `${booking._doc._id}`) < 0)
                       result.push({...booking._doc, likelihood : (group.likelihood * 100).toFixed(0)});
                });
            }
        });
    
        res.status(200).send({status: 'OK', matchedBookings : result});

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

function timePassed (bookingDate)
{
    const today= new Date();
    const todayStr = dateformat(today , 'yyyy-mm-dd');
    return (bookingDate < todayStr); 
}


module.exports = router;
