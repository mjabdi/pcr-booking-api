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
const {getDefaultTimeSlots, getHolidays} = require('./holidays');
const {Notification} = require('./../models/Notification');

const DEFAULT_LIMIT = 25

router.post('/paybooking' , async function (req,res,next) {

    try{
        const bookingId = ObjectId(req.query.id);
        const paidBy = req.query.paymentmethod;
        const corporate = req.query.corporate;
        await Booking.updateOne({_id: bookingId} , {paid: true, paidBy: paidBy, corporate: corporate ? corporate : ''});
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/unpaybooking' , async function (req,res,next) {

    try{
        const bookingId = ObjectId(req.query.id);
        await Booking.updateOne({_id: bookingId} , {paid: false, paidBy: '', corporate: ''});
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/resendemails' , async function (req,res,next) {

    try{
        const id = ObjectId(req.query.id);
        await Link.updateOne({_id: id} , {status: 'downloadFailed', dontSendEmail: false});
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/resendemailswithbookingid' , async function (req,res,next) {

    try{
        const id = ObjectId(req.query.id);

        const booking = await Booking.findOne({_id: id});

        await Link.updateOne({filename: booking.filename} , {status: 'downloadFailed', dontSendEmail: false});
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.post('/regeneratefiles' , async function (req,res,next) {

    try{
        const id = ObjectId(req.query.id);
        await Link.updateOne({_id: id} , {status: 'downloadFailed', dontSendEmail : true});
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/regeneratefileswithbookingid' , async function (req,res,next) {

    try{
        const id = ObjectId(req.query.id);
        const booking = await Booking.findOne({_id: id});
        await Link.updateOne({filename: booking.filename} , {status: 'downloadFailed', dontSendEmail : true});
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

router.get('/getlatebookings', async function(req, res, next) {

    try{

     const now = new Date();   
            
     const bookings = await Booking.find({$and: [{status : 'sample_taken'} , {samplingTimeStamp : {$ne : null}}]});
 
    const result = [];

    for (var i = 0; i < bookings.length ; i++)
    {
        let booking = bookings[i]._doc;

        const delay = parseInt((now - booking.samplingTimeStamp) / (3600*1000));

        if (delay >= 40)
        {
            result.push({...booking, delay: delay});
        }
    }
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

router.get('/getbookingscountbydatestr', async function(req, res, next) {

    try{
         const dateStr = req.query.date;
         if (!dateStr || dateStr.length <= 0)
         {
            res.status(400).send({status:'FAILED' , error: 'datestr query param not present!' });
            return;
         }
         const result = await Booking.countDocuments({bookingDate: dateStr , deleted : {$ne : true }, status: 'booked'}).exec();
         res.status(200).send({status: "OK", count : result});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getallbookingscountbydatestr', async function(req, res, next) {

    try{
         const dateStr = req.query.date;
         if (!dateStr || dateStr.length <= 0)
         {
            res.status(400).send({status:'FAILED' , error: 'datestr query param not present!' });
            return;
         }
         const result = await Booking.countDocuments({bookingDate: dateStr , deleted : {$ne : true }}).exec();
         res.status(200).send({status: "OK", count : result});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getbookingsstatsbydatestr', async function(req, res, next) {

    try{
         const dateStr = req.query.date;
         if (!dateStr || dateStr.length <= 0)
         {
            res.status(400).send({status:'FAILED' , error: 'datestr query param not present!' });
            return;
         }
          const result = await Booking.aggregate([
            {
                $match: {
                  bookingDate: dateStr,
                  deleted: {$ne : true}
                }
              },
    
              { $group:
                 {
                     "_id" : "$bookingTimeNormalized",
                                                                
                     "count": { "$sum" : 1 }               
                } 
            } ,
         ]);
         res.status(200).send({status: "OK", result : result});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.get('/getbookingscountbydatestrandtime', async function(req, res, next) {

    try{
         const dateStr = req.query.date;
         const timeStr = req.query.time;
         if (!dateStr || dateStr.length <= 0)
         {
            res.status(400).send({status:'FAILED' , error: 'datestr query param not present!' });
            return;
         }
         const result = await Booking.countDocuments({bookingDate: dateStr , bookingTime: timeStr, deleted : {$ne : true }, status: 'booked'}).exec();
         res.status(200).send({status: "OK", count : result});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getallbookingscountbydatestrandtime', async function(req, res, next) {

    try{
         const dateStr = req.query.date;
         const timeStr = req.query.time;
         if (!dateStr || dateStr.length <= 0)
         {
            res.status(400).send({status:'FAILED' , error: 'datestr query param not present!' });
            return;
         }
         const result = await Booking.countDocuments({bookingDate: dateStr , bookingTime: timeStr, deleted : {$ne : true }}).exec();
         res.status(200).send({status: "OK", count : result});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getbookingsbydatestrandtime', async function(req, res, next) {

    try{
        const dateStr = req.query.date;
        const timeStr = req.query.time;
        if (!dateStr || dateStr.length <= 0)
        {
           res.status(400).send({status:'FAILED' , error: 'datestr query param not present!' });
           return;
        }
        const result = await Booking.find({bookingDate: dateStr , bookingTime: timeStr, deleted : {$ne : true }, status: 'booked'}).sort({timeStamp:-1}).exec();
        res.status(200).send({status: "OK", bookings : result});
   }
   catch(err)
   {
       console.log(err);
       res.status(500).send({status:'FAILED' , error: err.message });
   }
});

router.get('/getallbookingsbydatestrandtime', async function(req, res, next) {

    try{
        const dateStr = req.query.date;
        const timeStr = req.query.time;
        if (!dateStr || dateStr.length <= 0)
        {
           res.status(400).send({status:'FAILED' , error: 'datestr query param not present!' });
           return;
        }
        const result = await Booking.find({bookingDate: dateStr , bookingTime: timeStr, deleted : {$ne : true }}).sort({timeStamp:-1}).exec();
        res.status(200).send({status: "OK", bookings : result});
   }
   catch(err)
   {
       console.log(err);
       res.status(500).send({status:'FAILED' , error: err.message });
   }
});

router.get('/getallbookings', async function(req, res, next) {

    try{

        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
        const result =  await Booking.find( {deleted : {$ne : true }} ).sort({bookingDate: -1, bookingTimeNormalized: -1}).limit(limit).exec();

         res.status(200).send(result);
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getdeletedbookings', async function(req, res, next) {

    try{

        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
        const   result = await Booking.find( {deleted : {$eq : true }} ).sort({bookingDate: -1, bookingTimeNormalized: -1}).limit(limit).exec();
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
        
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
        const result = await Booking.find({ $or: [{status: 'report_sent', deleted : {$ne : true }}, {status: 'report_cert_sent', deleted : {$ne : true }}]}).sort({bookingDate: -1, bookingTimeNormalized: -1}).limit(limit).exec();
        
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

         const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
         const result = await Booking.find({bookingDate : {$lt : today}, deleted : {$ne : true }}).sort({bookingDate: -1, bookingTimeNormalized: -1}).limit(limit).exec();

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

         const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
         const result = await Booking.find({bookingDate : {$gt : today}, deleted : {$ne : true }}).sort({bookingDate: 1, bookingTimeNormalized: 1}).limit(limit).exec();

         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getrecentbookings', async function(req, res, next) {

    try{
         const result = await Booking.find({deleted : {$ne : true }}).sort({timeStamp: -1}).limit(10).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getrecentbookingsall', async function(req, res, next) {

    try{
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
        const  result = await Booking.find({deleted : {$ne : true }}).sort({timeStamp: -1}).limit(limit).exec();
        res.status(200).send(result);
    }
    catch(err)
    {
        console.log(err)
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
                                         bookingDate: req.body.bookingDate,
                                         deleted: {$ne: true}
                                        
                                        });

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

        if (!checkBookingTime(booking))
        {
            const alaram = new Notification(
                {
                    timeStamp: new Date(),
                    type: 'InvalidBooking',
                    text: `An attempt to book on ${booking.bookingDate} at ${booking.bookingTime} Blocked by the system`
                }
            );
            await alaram.save();
            res.status(200).send({status:'FAILED' , error: 'FullTime', person: req.body});
            return;
        }

        await booking.save();
        
        await sendConfirmationEmail(req.body);

        if (req.body.antiBodyTest)
        {
            await sendAntiBodyEmail(req.body);
        }

        res.status(200).send({status: 'OK', person: req.body});

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

        const newBooking = await Booking.findOne({_id : req.body.bookingId});

        await sendConfirmationEmail(newBooking);

        if (newBooking.antiBodyTest && !oldBooking.antiBodyTest)
        {
            await sendAntiBodyEmail(newBooking);
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

        await Booking.updateOne({_id : req.body.bookingId}, {bookingDate : req.body.bookingDate, bookingTime : req.body.bookingTime, bookingTimeNormalized: NormalizeTime(req.body.bookingTime)});

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

router.post('/changebacktobookingmade', async function(req, res, next) {
   
    try
    {
        req.query.id = ObjectId(req.query.id);

    }catch(err)
    {
        console.error(err);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

        await Booking.updateOne({_id : req.query.id}, {status : 'booked'});

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
        console.error(err);
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

router.get('/getlinkdetailswithbookingid', async function(req, res, next) {

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
         const booking = await Booking.findOne({_id : req.query.id});
         if (booking)
         {
            const result = await Link.findOne({filename: booking.filename});
            res.status(200).send({status: 'OK', link : result});
         } 
         else
         {
            res.status(200).send({status: 'FAILED' , error: 'NOT FOUND LINK'});
         }

    }
    catch(err)
    {
        console.log(err);
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
            if (group.bookings.length > 0 && group.likelihood > 0.4)
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

router.get('/getteststimereport', async function(req, res, next) {

    try{
        const bookings = await Booking.find({$or: [{status: 'report_sent'}, {status: 'report_cert_sent'}]}).exec();
        const Links = await Link.find({isPCR: true}).sort({timeStamp:-1}).limit(bookings.length+200).exec();

        console.log(Links.length)
        console.log(bookings.length)
    
        var lessThan12 = 0;
        var lessThan24 = 0;
        var lessThan36 = 0;
        var lessThan48 = 0;
        var totoalTime = 0;

        var totalCount = 0;
    
        for (var i = 0; i < bookings.length ; i++)
        {
            let booking = bookings[i];
    
            if (!booking.samplingTimeStamp)
            {
                booking.samplingTimeStamp = createTimeStampFromBookingDate(booking.bookingDate, booking.bookingTime);
            }
    
            const link = Links.find(link =>  link.filename === booking.filename);

            if (link)
            {
    
                const delay = parseInt((link.timeStamp - booking.samplingTimeStamp) / (3600*1000));
        
                if (delay <= 12)
                    lessThan12++;
                else if (delay <= 24)
                    lessThan24++;
                else if (delay <= 36)
                    lessThan36++;
                else if (delay <= 48)
                    lessThan48++;   
            
                if (delay <= 48)
                {
                    totoalTime += delay; 
                    totalCount ++;
                }
             }
        }

        const lessThan12Percent = ((lessThan12 / totalCount) * 100).toFixed(1);
        const lessThan24Percent = ((lessThan24 / totalCount) * 100).toFixed(1);
        const lessThan36Percent = ((lessThan36 / totalCount) * 100).toFixed(1);
        const lessThan48Percent = ((lessThan48 / totalCount) * 100).toFixed(1);
    
        const result = {lessThan12, lessThan24, lessThan36, lessThan48, lessThan12Percent, lessThan24Percent, lessThan36Percent, lessThan48Percent  ,avg: (totoalTime / totalCount).toFixed(1)}
         res.status(200).send({status:'OK' , result: result});
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

function createTimeStampFromBookingDate(date, time){

    var hour = parseInt(time.substr(0,2));
    const minutes = parseInt(time.substr(3,2));
    const isPM = time.toLowerCase().indexOf('pm') > 0;

    if (isPM && hour < 12)
    {
        hour += 12;
    }

    if (!isPM && hour === 12)
    {
        hour = 0;
    }

    const year = parseInt(date.substr(0,4));
    const month = parseInt(date.substr(5,2)) - 1;
    const day = parseInt(date.substr(8,2));

    return new Date(year,month,day,hour,minutes,0,0);
}


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

    // body.bookingDate = body.bookingDate;
    // body.birthDate = body.birthDate;
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

function checkBookingTime(booking)
{
    const bookingDateStr = booking.bookingDate;
    const bookingTime = booking.bookingTime;

    const bookingDate = new Date(bookingDateStr);
    const todayStr = dateformat(new Date(),'yyyy-mm-dd');

    
    if (bookingDateStr < todayStr)
        return false;

     

    if (getHolidays().find(element => dateformat(element,'yyyy-mm-dd') === bookingDateStr))
    {
        return false;
    }

 

    const validTimeSlots = getDefaultTimeSlots(bookingDate);
    

    // console.log(validTimeSlots);
    // console.log(bookingTime);
    
    if (!validTimeSlots.find(element => (element.time === bookingTime && element.available === true)) )
    {
        return false;
    }

    // console.log(bookingDate);
    // console.log(bookingTime);

    return true;
}




module.exports = router;
