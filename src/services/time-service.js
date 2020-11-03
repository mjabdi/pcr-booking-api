const express = require('express');
const router = express.Router();
const TimeSlot = require('./../models/TimeSlot');
const dateformat = require('dateformat');
const {Booking} = require('../models/Booking');
const moment = require('moment-timezone');

const MAX_BOOKING_PER_SLOT = 3;

/// Get First Available Date
router.get('/getfirstavaiabledate', function(req, res, next) {

    var someDate = new Date(moment().tz("Europe/London").format());
    var duration = 0; //In Days
    someDate.setTime(someDate.getTime() +  (duration * 24 * 60 * 60 * 1000));
    
    res.send({date: someDate});
});


/// Get Time Slots For a Specific Date
router.get('/gettimeslots', async function(req, res, next) {

    try
    {
        validateGetTimeSlots(req.query);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    var timeSlots = [];
    const date = dateformat(req.query.date, 'yyyy-mm-dd');

    try{

        const defaultTimeSlots = getDefaultTimeSlots(req.query.date);     
        const result = await Booking.aggregate([
            {
                $match: {
                  bookingDate: date
                }
              },

              { $group:
                 {
                     _id : "$bookingTime", 
                     total: { $sum: 1 }               
                } 
            }
         ]);

        if (result.length === 0)
        {
            timeSlots = defaultTimeSlots;
        }
        else
        {
            defaultTimeSlots.forEach((timeSlot) => {
                if (result.find( (element) => (element._id === timeSlot.time) && (element.total >= MAX_BOOKING_PER_SLOT)))
                {
                    timeSlots.push(new TimeSlot(timeSlot.time, false));
                }
                else
                {
                    timeSlots.push(timeSlot);
                }
            });
        }

        res.send(timeSlots);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

const validateGetTimeSlots = (query) => {

    if (!query.date){
        throw new Error('date field not present');
    }

    return true;
}

const getDefaultTimeSlots = (date) =>
{
    const someDate = new Date(date);

    var results = [];
    var finalResults = [];

    if (someDate.getDay() === 0 || someDate.getDay() === 6) /// Weekend
    {
        results = TIME_SLOTS_WEEKEND;
    }
    else
    {
        results = TIME_SLOTS_NORMAL;
    }

    var currentTime = new Date(moment().tz("Europe/London").format());

    if (someDate.getFullYear() === currentTime.getFullYear() 
           && someDate.getMonth() === currentTime.getMonth()
           && someDate.getDate() === currentTime.getDate()
           ){

                results.forEach( (time) => {

                    if (TimePast(time.time))
                    {
                        finalResults.push(new TimeSlot(time.time, false));
                    }
                    else
                    {
                        finalResults.push(time);
                    }
                });
           }

           return finalResults;
}

function TimePast(time)
{
    const currentTime = new Date(moment().tz("Europe/London").format());

    var hour = parseInt(time.substr(0,2));
    var minute = parseInt(time.substr(3,2));
    if (time.toLowerCase().indexOf('pm') > 0 && hour < 12)
    {
        hour += 12;
    }

    if (hour > currentTime.getHours() || (hour === currentTime.getHours() && minute > currentTime.getMinutes()))
    {
        return false;
    }
    else
    {
        return true;
    }
}


const TIME_SLOTS_NORMAL = [
    new TimeSlot('09:00 AM', true),
    new TimeSlot('09:15 AM', true),
    new TimeSlot('09:30 AM', true),
    new TimeSlot('09:45 AM', true),
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:15 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('10:45 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:15 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('11:45 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:15 PM', true),
    new TimeSlot('12:30 PM', true),
    new TimeSlot('12:45 PM', true),
    new TimeSlot('01:00 PM', true),
    new TimeSlot('01:15 PM', true),
    new TimeSlot('01:30 PM', true),
    new TimeSlot('01:45 PM', true),
    new TimeSlot('02:00 PM', true),
    new TimeSlot('02:15 PM', true),
    new TimeSlot('02:30 PM', true),
    new TimeSlot('02:45 PM', true),
    new TimeSlot('03:00 PM', true),
    new TimeSlot('03:15 PM', true),
    new TimeSlot('03:30 PM', true),
    new TimeSlot('03:45 PM', true),
    new TimeSlot('04:00 PM', true),
    new TimeSlot('04:15 PM', true),
    new TimeSlot('04:30 PM', true),
    new TimeSlot('04:45 PM', true),
    new TimeSlot('05:00 PM', true),
    new TimeSlot('05:15 PM', true),
    new TimeSlot('05:30 PM', true),
    new TimeSlot('05:45 PM', true)
];

const TIME_SLOTS_WEEKEND = [
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:15 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('10:45 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:15 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('11:45 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:15 PM', true),
    new TimeSlot('12:30 PM', true),
    new TimeSlot('12:45 PM', true),
    new TimeSlot('01:00 PM', true),
    new TimeSlot('01:15 PM', true),
    new TimeSlot('01:30 PM', true),
    new TimeSlot('01:45 PM', true),
]



module.exports = router;
