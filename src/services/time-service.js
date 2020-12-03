const express = require('express');
const router = express.Router();
const TimeSlot = require('./../models/TimeSlot');
const dateformat = require('dateformat');
const {Booking} = require('../models/Booking');


const MAX_BOOKING_PER_SLOT = 7;

function getNow()
{
    //const now = new Date(moment().tz("Europe/London").format());
    
    return new Date();
}

function isWeekend(date)
{
    return (date.getDay() === 0 || date.getDay() === 6) /// Weekend
}

/// Get First Available Date
router.get('/getfirstavaiabledate', function(req, res, next) {

    var someDate = new Date(getNow());

    if (isWeekend(someDate))
    {
        if (someDate.getHours() >= 14)
        {
            someDate.setTime(someDate.getTime() +  (1 * 24 * 60 * 60 * 1000));
        }

    }else
    {
        if (someDate.getHours() >= 18)
        {
            someDate.setTime(someDate.getTime() +  (1 * 24 * 60 * 60 * 1000));
        }
    }

    // var duration = 0; //In Days
    // someDate.setTime(someDate.getTime() +  (duration * 24 * 60 * 60 * 1000));

    res.send({date: someDate});
});

/// Get Fully Booked Days Date
router.get('/getfullybookeddays', function(req, res, next) {
    
    var holidays = [];
    // holidays.push(new Date(2020,11,24,0,0,0,0));
    holidays.push(new Date(2020,11,25,0,0,0,0));
    holidays.push(new Date(2020,11,26,0,0,0,0));
    holidays.push(new Date(2021,0,1,0,0,0,0));
  
    res.send(holidays);
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
        // const result = await Booking.aggregate([
        //     {
        //         $match: {
        //           bookingDate: date,
        //           deleted: {$ne : true}
        //         }
        //       },
    
        //       { $group:
        //          {
        //              "_id" : {
        //                 "bookingTime" : "$bookingTime",
        //                 "bookingRef": "$bookingRef"
    
        //              } ,
        //              "bookCount": { "$sum" : 1 }               
        //         } 
        //     } ,
    
        //     { $group:
        //         {
        //             _id : "$_id.bookingTime",
        //             total : { $sum: 1 }               
        //        } 
        //    },
    
        //  ]).sort({_id: 1}).exec();

         const result2 = await Booking.aggregate([
            {
                $match: {
                  bookingDate: date,
                  deleted: {$ne : true}
                }
              },
        
              { $group:
                 {_id : "$bookingTime",
                 total : { $sum: 1 }               
                } 
            } ,
        
         ]).sort({_id: 1}).exec();

        if (result2.length === 0)
        {
            timeSlots = [...defaultTimeSlots];
        }
        else
        {
            defaultTimeSlots.forEach((timeSlot) => {
                if (result2.find( (element) => (element._id === timeSlot.time) && (element.total >= MAX_BOOKING_PER_SLOT)) 
                        // || result2.find( (element) => (element._id === timeSlot.time) && (element.total >= MAX_BOOKING_PER_SLOT))
                    )
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

    if (!query.date || query.date === 'undefined'){
        throw new Error('date field not present');
    }

    return true;
}

const getDefaultTimeSlots = (date) =>
{
    const someDate = new Date(date);

    var results = [];
    var finalResults = [];

    if (isWeekend(someDate)) /// Weekend
    {
        results = TIME_SLOTS_WEEKEND;
    }
    else
    {
        results = TIME_SLOTS_NORMAL;
    }

    const dateStr = dateformat(someDate, 'yyyy-mm-dd');
    const todayStr = dateformat(new Date(), 'yyyy-mm-dd');
    const is24Dec = (dateStr === '2020-12-24' || dateStr === '2020-12-31' );
    const isToday = (dateStr === todayStr);


    for (var i=0; i < results.length; i++)
    {

         if (isToday && TimePast(results[i].time))
         {
             finalResults.push(new TimeSlot(results[i].time, false));
         }
         else if (is24Dec && results[i].time.toUpperCase().indexOf('PM') > 0)
         {
            finalResults.push(new TimeSlot(results[i].time, false));
         }
         else 
         {
             finalResults.push(results[i]);
         }  
    }
    
    
    return finalResults;
}

function TimePast(time)
{
    const currentTime = new Date(getNow());

    var hour = parseInt(time.substr(0,2));
    var minute = parseInt(time.substr(3,2));
    if (time.toLowerCase().indexOf('pm') > 0 && hour < 12)
    {
        hour += 12;
    }

    if (hour > currentTime.getHours() || (hour === currentTime.getHours() && (minute + 15) > currentTime.getMinutes()))
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
