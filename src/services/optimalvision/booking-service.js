const express = require('express');
const router = express.Router();
const { OVBooking } = require('../../models/optimalvision/OVBooking');
const dateformat = require('dateformat');
const { sendScheduledEmail, sendConfirmationEmail, sendNotificationEmail } = require('./email-service');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { getDefaultTimeSlots, getHolidays } = require('./holidays');


router.post('/bookappointment', async function (req, res, next) {

    try {
        let { fullname, email, phone, birthDate, notes, clinic, bookingDate, bookingTime, patientID, prescriptionLeft, prescriptionRight } = req.body;

        if (!email) {
            email = "-"
        }
        if (!phone) {
            phone = "-"
        }

        const booking = new OVBooking(
            {
                timeStamp: new Date(),
                fullname: fullname,
                email: email,
                phone: phone,
                birthDate: birthDate,
                notes: notes,
                clinic: clinic,
                bookingDate: bookingDate,
                bookingTime: bookingTime,
                patientID: patientID,
                prescriptionLeft: prescriptionLeft,
                prescriptionRight: prescriptionRight
            }
        )

        await booking.save()

        // await sendConfirmationEmail(booking)

        res.status(200).send({ status: "OK", booking: booking });
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});



router.post('/bookconsultation', async function (req, res, next) {

    try {
        const { fullname, email, phone, faceToFaceConsultation, telephoneConsultation, questions, referrer } = req.body;

        const booking = new OVBooking(
            {
                timeStamp: new Date(),
                fullname: fullname,
                email: email,
                phone: phone,
                faceToFaceConsultation: faceToFaceConsultation,
                telephoneConsultation: telephoneConsultation,
                questions: questions ? JSON.stringify(questions) : null,
                referrer: referrer
            }
        )

        await booking.save()

        await sendConfirmationEmail(booking)

        res.status(200).send({ status: "OK", booking: booking, timeData: getDays() });
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});

router.post('/setdatetime', async function (req, res, next) {

    try {
        let { bookingId } = req.query
        bookingId = new ObjectId(bookingId)

        const { bookingDate, bookingTime } = req.body;

        const booking = await OVBooking.findOne({ _id: bookingId })
        if (booking) {
            booking.bookingDate = bookingDate
            booking.bookingTime = bookingTime
            await booking.save()
            await sendScheduledEmail(booking)
            await sendNotificationEmail(booking)

            res.status(200).send({ status: "OK", booking: booking });
        } else {
            res.status(400).send({ status: "FAILED", error: "Booking Not Found" });
        }

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});

// router.get('/getdays' , async function (req,res,next) {

//     try{

//        const DAY_MILISECONDS = 24 * 60 * 60 * 1000 

//        const AvailableDays = [] 
//        const now = new Date()
//        let todayAvailable = true
//        if (now.getHours() >= 18)
//        {
//          todayAvailable = false
//        }

//        let firstTimeIndex = 0;
//        if (now.getHours() >= 16) firstTimeIndex = 4;
//        else if (now.getHours() >= 14) firstTimeIndex = 3;
//        else if (now.getHours() >= 12) firstTimeIndex = 2;
//        else if (now.getHours() >= 10) firstTimeIndex = 1;

//        AvailableDays.push({date : dateformat(now,'yyyy-mm-dd'), dayLabel: "Today" ,  available: todayAvailable})

//        const tomorrow = new Date(now.getTime() + 1 * DAY_MILISECONDS )
//        AvailableDays.push({date : dateformat(tomorrow,'yyyy-mm-dd'), dayLabel: "Tomorrow" ,  available: true})

//        for (var i = 1 ; i <= 2 ; i++)
//        {
//            let _date = new Date(tomorrow.getTime() + i * DAY_MILISECONDS )
//            AvailableDays.push({date : dateformat(_date,'yyyy-mm-dd'), dayLabel: dateformat(_date,'dddd, mmmm dS') ,  available: true})
//        }


//        res.status(200).send({status : "OK", days: AvailableDays, defaultTimes: defaultTimes, firstTimeIndex: firstTimeIndex});

//     }
//     catch(err)
//     {
//         console.log(err)
//         res.status(500).send({status:'FAILED' , error: err.message });
//     }
// });

function getDays() {
    try {

        const DAY_MILISECONDS = 24 * 60 * 60 * 1000

        const AvailableDays = []
        const now = new Date()
        let todayAvailable = true
        if (now.getHours() >= 18) {
            todayAvailable = false
        }

        let firstTimeIndex = 0;
        if (now.getHours() >= 16) firstTimeIndex = 4;
        else if (now.getHours() >= 14) firstTimeIndex = 3;
        else if (now.getHours() >= 12) firstTimeIndex = 2;
        else if (now.getHours() >= 10) firstTimeIndex = 1;

        AvailableDays.push({ date: dateformat(now, 'yyyy-mm-dd'), dayLabel: "Today", available: todayAvailable })

        const tomorrow = new Date(now.getTime() + 1 * DAY_MILISECONDS)
        AvailableDays.push({ date: dateformat(tomorrow, 'yyyy-mm-dd'), dayLabel: "Tomorrow", available: true })

        if (!todayAvailable) {
            let _date = new Date(tomorrow.getTime() + 1 * DAY_MILISECONDS)
            AvailableDays.push({ date: dateformat(_date, 'yyyy-mm-dd'), dayLabel: dateformat(_date, 'dddd, mmmm dS'), available: true })
        }

        // for (var i = 1 ; i <= 2 ; i++)
        // {
        //     let _date = new Date(tomorrow.getTime() + i * DAY_MILISECONDS )
        //     AvailableDays.push({date : dateformat(_date,'yyyy-mm-dd'), dayLabel: dateformat(_date,'dddd, mmmm dS') ,  available: true})
        // }


        return ({ status: "OK", days: AvailableDays, defaultTimes: defaultTimes, firstTimeIndex: firstTimeIndex });

    }
    catch (err) {
        console.log(err)
        return ({ status: 'FAILED', error: err.message });
    }
}

router.get('/getallbookings', async function (req, res, next) {

    try {
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
        const result = await OVBooking.find({ deleted: { $ne: true }, clinic: {$eq: null}  }).sort({ bookingDate: -1, bookingTimeNormalized: -1 }).limit(limit).exec();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});

router.get('/getdeletedbookings', async function (req, res, next) {

    try {
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
        const result = await OVBooking.find({ deleted: { $eq: true }, clinic: {$eq: null}  }).sort({ bookingDate: -1, bookingTimeNormalized: -1 }).limit(limit).exec();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});


router.get('/gettodaybookings', async function (req, res, next) {

    try {
        const today = dateformat(new Date(), 'yyyy-mm-dd');

        const result = await OVBooking.find({ bookingDate: today, deleted: { $ne: true }, clinic: {$eq: null} }).sort({ bookingTimeNormalized: 1 }).exec();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});

router.get('/getoldbookings', async function (req, res, next) {

    try {
        const today = dateformat(new Date(), 'yyyy-mm-dd');
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
        const result = await OVBooking.find({ bookingDate: { $lt: today }, clinic: {$eq: null} , deleted: { $ne: true } }).sort({ bookingDate: -1, bookingTimeNormalized: -1 }).limit(limit).exec();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});

router.get('/getfuturebookings', async function (req, res, next) {

    try {
        const today = dateformat(new Date(), 'yyyy-mm-dd');
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
        const result = await OVBooking.find({ bookingDate: { $gt: today }, deleted: { $ne: true }, clinic: {$eq: null}  }).sort({ bookingDate: 1, bookingTimeNormalized: 1 }).limit(limit).exec();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});

router.get('/getrecentbookings', async function (req, res, next) {

    try {
        const result = await OVBooking.find({ deleted: { $ne: true }, clinic: {$eq: null}  }).sort({ timeStamp: -1 }).limit(10).exec();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});

router.get('/getrecentbookingsall', async function (req, res, next) {

    try {
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
        const result = await OVBooking.find({ deleted: { $ne: true }, clinic: {$eq: null}  }).sort({ timeStamp: -1 }).limit(limit).exec();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});


router.post('/deletebookappointment', async function (req, res, next) {

    try {
        req.query.id = ObjectId(req.query.id);

    } catch (err) {
        console.error(err);
        res.status(400).send({ status: 'FAILED', error: err.message });
        return;
    }

    try {

        await OVBooking.updateOne({ _id: req.query.id }, { deleted: true });

        res.status(200).send({ status: 'OK' });

    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'FAILED', error: err.message });
        return;
    }
});

router.post('/undeletebookappointment', async function (req, res, next) {

    try {
        req.query.id = ObjectId(req.query.id);

    } catch (err) {
        console.error(err.message);
        res.status(400).send({ status: 'FAILED', error: err.message });
        return;
    }

    try {

        await OVBooking.updateOne({ _id: req.query.id }, { deleted: false });

        res.status(200).send({ status: 'OK' });

    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'FAILED', error: err.message });
        return;
    }
});


router.get('/getbookingbyid', async function (req, res, next) {

    try {
        req.query.id = ObjectId(req.query.id);
        const result = await OVBooking.findOne({ _id: req.query.id });
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});


router.get('/getallbookingscountbydatestr', async function (req, res, next) {

    try {
        const dateStr = req.query.date;
        if (!dateStr || dateStr.length <= 0) {
            res.status(400).send({ status: 'FAILED', error: 'datestr query param not present!' });
            return;
        }

        const result = await OVBooking.aggregate([
            {
                $match: {
                  bookingDate: dateStr,
                  deleted: {$ne : true},
                  clinic : {$ne: null}
                }
              },
    
              { $group:
                 {
                     "_id" : "$clinic",                                                                
                     "count": { "$sum" : 1 }               
                } 
            } ,
         ]);

         const count = result.map(item => ({clinic: item._id, count: item.count}))


        res.status(200).send({ status: "OK", count: count });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});

router.get('/getallbookingscountbydatestrandtime', async function (req, res, next) {

    try {
        const dateStr = req.query.date;
        const timeStr = req.query.time;
        if (!dateStr || dateStr.length <= 0) {
            res.status(400).send({ status: 'FAILED', error: 'datestr query param not present!' });
            return;
        }
        const result = await OVBooking.aggregate([
            {
                $match: {
                  bookingDate: dateStr,
                  bookingTime: timeStr,
                  deleted: {$ne : true},
                  clinic : {$ne: null}
                }
              },
    
              { $group:
                 {
                     "_id" : "$clinic",                                                                
                     "count": { "$sum" : 1 }               
                } 
            } ,
         ]);

         const count = result.map(item => ({clinic: item._id, count: item.count}))

        


        res.status(200).send({ status: "OK", count: count });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});

router.get('/getallbookingsbydatestrandtime', async function (req, res, next) {

    try {
        const dateStr = req.query.date;
        const timeStr = req.query.time;
        if (!dateStr || dateStr.length <= 0) {
            res.status(400).send({ status: 'FAILED', error: 'datestr query param not present!' });
            return;
        }
        const result = await OVBooking.find({ bookingDate: dateStr, bookingTime: timeStr, deleted: { $ne: true } }).sort({ timeStamp: 1 }).exec();
        res.status(200).send({ status: "OK", bookings: result });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ status: 'FAILED', error: err.message });
    }
});


router.post('/updatebookappointment', async function(req, res, next) {

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

        const oldBooking = await OVBooking.findOne({_id : req.body.bookingId});

        await OVBooking.updateOne({_id : req.body.bookingId}, {...req.body});

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

        await OVBooking.deleteOne({_id : req.query.id});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});




const defaultTimes = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 08:00 PM"
]




module.exports = router;
