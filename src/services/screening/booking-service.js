const express = require('express');
const router = express.Router();
const {ScreeningBooking} = require('../../models/screening/ScreeningBooking');
const dateformat = require('dateformat');
const {sendConfirmationEmail, sendRegFormEmail, sendPatientNotificationEmail} = require('./email-service');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {getDefaultTimeSlots, getHolidays} = require('./holidays');
const {Notification} = require('./../../models/Notification');
const { sendAdminNotificationEmail, NOTIFY_TYPE } = require('../mail-notification-service');
const getNewRef = require('../refgenatator-service');

const {sendHealthScreeningConfirmationTextMessage} = require('../medex/payment/twilio-service')

const { Client, Environment } = require("square");
const SANDBOX = process.env.NODE_ENV !== "production";

const LIVE_ACCESSTOKEN =
  "EAAAEAxDlhTfsK7_QcWlXIS8mpoNsGyWu6GOtROECsno-txpY1bnzlPtyCscFpMt"; // live
const SANDBOX_ACCESSTOKEN =
  "EAAAEHpXroK4v3SCYQTdflulI8A8BlUGdy56BSVPX7-a5nicjp9dyF7ezj8iiFzm"; // sandbox

const LIVE_LOCATION_ID = "L2SBNYPV0XWVJ"; // live
const SANDBOX_LOCATION_ID = "LBR8YPCPR878R"; // sandbox

const client = new Client({
  environment: SANDBOX ? Environment.Sandbox : Environment.Production,
  accessToken: SANDBOX ? SANDBOX_ACCESSTOKEN : LIVE_ACCESSTOKEN,
});

const refundsApi = client.refundsApi;


const DEFAULT_LIMIT = 25


router.post('/setclinicnotes' , async function (req,res,next) {

    try{
        const {bookingId, notes} = req.body;
        await ScreeningBooking.updateOne({_id: bookingId} , {clinicNotes: notes});
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/sendregformemail' , async function (req,res,next) {

    try{
        const {id} = req.query;
        const booking =  await ScreeningBooking.findOne({_id: id});
        sendRegFormEmail(booking)
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.post('/sendforprint' , async function (req,res,next) {

    try{
        const {id} = req.query;
        const booking =  await ScreeningBooking.findOne({_id: id});
        booking.printStatus = "preparing"
        await booking.save()
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/submitformdata' , async function (req,res,next) {

    try{
        const {bookingId, formData} = req.body;
        await ScreeningBooking.updateOne({_id: bookingId} , {formData: JSON.stringify(formData)});
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/paybooking' , async function (req,res,next) {

    try{
        const bookingId = ObjectId(req.query.id);
        const paidBy = req.query.paymentmethod;
        const corporate = req.query.corporate;
        const price = parseFloat(req.query.price)
        await ScreeningBooking.updateOne({_id: bookingId} , {paid: true, OTCCharges:price, paidBy: paidBy, corporate: corporate ? corporate : ''});
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
        await ScreeningBooking.updateOne({_id: bookingId} , {paid: false, OTCCharges:0, paidBy: '', corporate: ''});
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.get('/getshouldrefundscount', async function(req, res, next) {
    try{
        const count = await ScreeningBooking.countDocuments({deleted : {$eq: true}, deposit: {$gt : 0} })
        res.status(200).send({status : "OK", count: count });
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }


});

router.get('/getbookingscountbydatestr', async function(req, res, next) {

    try{
         const dateStr = req.query.date;
         if (!dateStr || dateStr.length <= 0)
         {
            res.status(400).send({status:'FAILED' , error: 'datestr query param not present!' });
            return;
         }
         const result = await ScreeningBooking.countDocuments({bookingDate: dateStr , deleted : {$ne : true }, status: 'booked'}).exec();
         res.status(200).send({status: "OK", count : result});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getallbookingscountall', async function(req, res, next) {

    try{
         const result = await ScreeningBooking.countDocuments({deleted : {$ne : true }}).exec();
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
         const result = await ScreeningBooking.countDocuments({bookingDate: dateStr , deleted : {$ne : true }}).exec();
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
          const result = await ScreeningBooking.aggregate([
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
         const result = await ScreeningBooking.countDocuments({bookingDate: dateStr , bookingTime: timeStr, deleted : {$ne : true }, status: 'booked'}).exec();
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
         const result = await ScreeningBooking.countDocuments({bookingDate: dateStr , bookingTime: timeStr, deleted : {$ne : true }}).exec();
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
        const result = await ScreeningBooking.find({bookingDate: dateStr , bookingTime: timeStr, deleted : {$ne : true }, status: 'booked'}).sort({timeStamp:1}).exec();
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
        const result = await ScreeningBooking.find({bookingDate: dateStr , bookingTime: timeStr, deleted : {$ne : true }}).sort({timeStamp:1}).exec();
        res.status(200).send({status: "OK", bookings : result});
   }
   catch(err)
   {
       console.log(err);
       res.status(500).send({status:'FAILED' , error: err.message });
   }
});

router.get('/getpendingbookings', async function(req, res, next) {

    try{
        //  const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
         const result = await ScreeningBooking.find( {deleted : {$ne : true }, confirmed: {$ne : true }, tbcFolder: {$ne:true}}).sort({bookingDate: -1, bookingTimeNormalized: -1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.get('/getallbookings', async function(req, res, next) {

    try{
         const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
         const result = await ScreeningBooking.find( {deleted : {$ne : true }, confirmed: true} ).sort({bookingDate: -1, bookingTimeNormalized: -1}).limit(limit).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getdeletedbookings', async function(req, res, next) {

    try{
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
         const result = await ScreeningBooking.find( {deleted : {$eq : true }} ).sort({bookingDate: -1, bookingTimeNormalized: -1}).limit(limit).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/gettbcfolderbookings', async function(req, res, next) {

    try{
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
         const result = await ScreeningBooking.find( {tbcFolder : {$eq : true }, confirmed: {$ne : true}} ).sort({bookingDate: -1, bookingTimeNormalized: -1}).limit(limit).exec();
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

         const result = await ScreeningBooking.find({bookingDate : today, deleted : {$ne : true }, confirmed: true}).sort({bookingTimeNormalized: 1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getlivebookings', async function(req, res, next) {

    try{
         const result = await ScreeningBooking.find({bookingDate : {$gt : "2022-02-19"}, status: "patient_attended", deleted : {$ne : true }, confirmed: true}).sort({bookingDate: 1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getcompletedbookings', async function (req, res, next) {

    try {
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
        const result = await ScreeningBooking.find({ status: "report_sent", deleted: { $ne: true }, confirmed: true }).sort({ bookingDate: -1, bookingTimeNormalized: -1 }).limit(limit).exec();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});

router.get('/getoldbookings', async function(req, res, next) {

    try{
        const today = dateformat(new Date(), 'yyyy-mm-dd');
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
         const result = await ScreeningBooking.find({bookingDate : {$lt : today}, deleted : {$ne : true }, confirmed: true}).sort({bookingDate: -1, bookingTimeNormalized: -1}).limit(limit).exec();
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
         const result = await ScreeningBooking.find({bookingDate : {$gt : today}, deleted : {$ne : true }, confirmed: true}).sort({bookingDate: 1, bookingTimeNormalized: 1}).limit(limit).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getrecentbookings', async function(req, res, next) {

    try{
         const result = await ScreeningBooking.find({deleted : {$ne : true },confirmed: true}).sort({timeStamp: -1}).limit(10).exec();
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
         const result = await ScreeningBooking.find({deleted : {$ne : true },confirmed: true}).sort({timeStamp: -1}).limit(limit).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.get('/getbookingsbyref', async function(req, res, next) {

    try{
         const result = await ScreeningBooking.find({bookingRef : req.query.ref});
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
         const result = await ScreeningBooking.findOne({_id : req.query.id});
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/addnewbooking', async function(req, res, next) {
    try{
        const ref = await getNewRef()
        let {fullname, bookingDate, bookingTime, phone, email, notes, service, birthDate, gender, address, smsPush} = req.body

  
          if (!email || email.length < 1) {
            email = "-";
          }
  
          if (!phone || phone.length < 1) {
            phone = "-";
          }

        const payload =  {fullname, bookingDate, bookingTime, phone, email, notes, service, birthDate, gender, address, smsPush}


        const booking = new ScreeningBooking(
            {
                ...payload,
                bookingRef: ref,
                bookingTimeNormalized : NormalizeTime(payload.bookingTime),
                timeStamp: new Date(),
                confirmed: true
            }
        );

        await booking.save()
        if (email && email.length > 3)
        {
            await sendConfirmationEmail(booking);
        }

        if (phone && phone.length > 3)
        {
            await sendHealthScreeningConfirmationTextMessage(booking)
        }
      

        // await sendAdminNotificationEmail(NOTIFY_TYPE.NOTIFY_TYPE_GYNAE_BOOKED, booking)

        res.status(200).send({status: 'OK', person: req.body});

    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
})



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

        const found = await ScreeningBooking.findOne({email : req.body.email,
                                         bookingDate: req.body.bookingDate,
                                         deleted: {$ne: true}                                      
                                        });

        if (found)
        {

            res.status(200).send({status:'FAILED' , error: 'Repeated Booking!', person: req.body});
            return;
        }

        const booking = new ScreeningBooking(
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
                    type: 'InvalidBooking-HS',
                    text: `An attempt to book on ${booking.bookingDate} at ${booking.bookingTime} Blocked by the system (HS)`
                }
            );
            await alaram.save();
            res.status(200).send({status:'FAILED' , error: 'FullTime', person: req.body});
            return;
        }

        await booking.save();
        
        await sendPatientNotificationEmail(booking);

        await sendAdminNotificationEmail(NOTIFY_TYPE.NOTIFY_TYPE_HEALTHSCREENING_BOOKED,booking)

        res.status(200).send({status: 'OK', person: req.body});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.post('/confirmbookappointment', async function(req, res, next) {

    try
    {
        req.query.bookingId = ObjectId(req.query.bookingId);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

        // const oldBooking = await ScreeningBooking.findOne({_id : req.body.bookingId});

        await ScreeningBooking.updateOne({_id : req.query.bookingId}, {confirmed: true});

        const newBooking = await ScreeningBooking.findOne({_id : req.query.bookingId});

        await sendConfirmationEmail(newBooking);
        await sendHealthScreeningConfirmationTextMessage(newBooking)


        res.status(200).send({status: 'OK'});

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

        const oldBooking = await ScreeningBooking.findOne({_id : req.body.bookingId});

        await ScreeningBooking.updateOne({_id : req.body.bookingId}, {...req.body.person});

        const newBooking = await ScreeningBooking.findOne({_id : req.body.bookingId});

        if (oldBooking.bookingDate !== newBooking.bookingDate || 
            oldBooking.bookingTime !== newBooking.bookingTime)
            {
                await ScreeningBooking.updateOne({_id : req.body.bookingId}, {timeChanged: true});
            }

        // await sendConfirmationEmail(newBooking);

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

        await ScreeningBooking.updateOne({_id : req.body.bookingId}, {bookingDate : req.body.bookingDate, bookingTime : req.body.bookingTime, bookingTimeNormalized: NormalizeTime(req.body.bookingTime)});

        // const booking = await ScreeningBooking.findOne({_id : req.body.bookingId});

        // await sendConfirmationEmail(booking);

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

        await ScreeningBooking.updateOne({_id : req.query.id}, {status : 'booked'});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }

});

router.post('/changetopatientattended', async function(req, res, next) {
   
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

        await ScreeningBooking.updateOne({_id : req.query.id}, {status : 'patient_attended'});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }

});

router.post('/changetocompleted', async function(req, res, next) {
   
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

        await ScreeningBooking.updateOne({_id : req.query.id}, {status : 'report_sent'});

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

        await ScreeningBooking.updateOne({_id : req.query.id}, {deleted : true});

        await refundPayment(req.query.id)


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

        await ScreeningBooking.updateOne({_id : req.query.id}, {deleted : false});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});


router.post('/movetbcfolder', async function(req, res, next) {

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

        await ScreeningBooking.updateOne({_id : req.query.id}, {tbcFolder : true});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.post('/undomovetbcfolder', async function(req, res, next) {

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

        await ScreeningBooking.updateOne({_id : req.query.id}, {tbcFolder : false});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});



 const validateBookAppointment = (body) => {

    console.log(body);

    if (!body.fullname) 
    {    
        throw new Error('fullname field not present');
    }

    if (!body.email) 
    {
        throw new Error('email field not present');
    }

    if (!body.phone) 
    {
        throw new Error('phone field not present');
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

    if (!body.service) 
    {
        throw new Error('service field not present');
    }



    body.bookingTimeNormalized = NormalizeTime(body.bookingTime);

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

router.post('/changedepositbooking' , async function (req,res,next) {

    try{
        const {id, deposit} = req.query;
        const booking =  await ScreeningBooking.findOne({_id: id});
        booking.deposit = deposit
        await booking.save()
        res.status(200).send({status : "OK"});
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
    }
})


async function refundPayment(bookingId){
    try {
        const booking = await ScreeningBooking.findOne({ _id: bookingId });

        if (!booking || !booking.paymentInfo) {
          return;
        }
    
        if (booking.refund) {
          return;
        }
    
        const paymentInfo = JSON.parse(booking.paymentInfo);
    
        const payload = {
          idempotencyKey: booking._id.toString(),
          amountMoney: paymentInfo.totalMoney,
          paymentId: paymentInfo.id,
          autocomplete: true,
        };
    
        const { result } = await refundsApi.refundPayment(payload);
    
        if (result && result.refund && result.refund.id) {
          booking.deposit = 0;
          result.refund.amountMoney.amount = parseInt(result.refund.amountMoney.amount.toString().replace("n", ""))
          result.refund.processingFee = []

          booking.refund = JSON.stringify(result.refund);
          await booking.save();
    
          try {
            await sendRefundNotificationEmail(booking);
          } catch (err) {
            console.log(err);
          }
        } 
      } catch (err) {
        console.log(err);
      }    
}




module.exports = router;
