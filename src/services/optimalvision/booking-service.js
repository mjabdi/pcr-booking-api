const express = require('express');
const router = express.Router();
const {OVBooking} = require('../../models/optimalvision/OVBooking');
const dateformat = require('dateformat');
const {sendConfirmationEmail} = require('./email-service');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {getDefaultTimeSlots, getHolidays} = require('./holidays');


router.post('/bookconsultation' , async function (req,res,next) {

    try{
        const {fullname, email, phone, faceToFaceConsultation, telephoneConsultation} = req.body;
        const booking =  new OVBooking(
            {
                timeStamp : new Date(),
                fullname: fullname,
                email: email,
                phone: phone,
                faceToFaceConsultation: faceToFaceConsultation,
                telephoneConsultation: telephoneConsultation
            }
        )

        await booking.save()

        res.status(200).send({status : "OK", booking: booking, timeData: getDays()});
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.post('/setdatetime' , async function (req,res,next) {

    try{
        let {bookingId} = req.query
        bookingId = new ObjectId(bookingId)

        const {bookingDate, bookingTime} = req.body;

        const booking = await OVBooking.findOne({_id: bookingId})
        if (booking)
        {
            await booking.save()
            res.status(200).send({status : "OK", booking: booking});
        }else
        {
            res.status(400).send({status : "FAILED", error: "Booking Not Found"});
        }
       
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
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

function getDays () {
    try{
    
        const DAY_MILISECONDS = 24 * 60 * 60 * 1000 
 
        const AvailableDays = [] 
        const now = new Date()
        let todayAvailable = true
        if (now.getHours() >= 18)
        {
          todayAvailable = false
        }
 
        let firstTimeIndex = 0;
        if (now.getHours() >= 16) firstTimeIndex = 4;
        else if (now.getHours() >= 14) firstTimeIndex = 3;
        else if (now.getHours() >= 12) firstTimeIndex = 2;
        else if (now.getHours() >= 10) firstTimeIndex = 1;
 
        AvailableDays.push({date : dateformat(now,'yyyy-mm-dd'), dayLabel: "Today" ,  available: todayAvailable})
 
        const tomorrow = new Date(now.getTime() + 1 * DAY_MILISECONDS )
        AvailableDays.push({date : dateformat(tomorrow,'yyyy-mm-dd'), dayLabel: "Tomorrow" ,  available: true})
 
        for (var i = 1 ; i <= 2 ; i++)
        {
            let _date = new Date(tomorrow.getTime() + i * DAY_MILISECONDS )
            AvailableDays.push({date : dateformat(_date,'yyyy-mm-dd'), dayLabel: dateformat(_date,'dddd, mmmm dS') ,  available: true})
        }
 
 
        return({status : "OK", days: AvailableDays, defaultTimes: defaultTimes, firstTimeIndex: firstTimeIndex});
        
     }
     catch(err)
     {
         console.log(err)
         return({status:'FAILED' , error: err.message });
     }
}


const defaultTimes = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 08:00 PM"
]




module.exports = router;
