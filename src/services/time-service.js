const express = require('express');
const router = express.Router();
const TimeSlot = require('./../models/TimeSlot');
const dateformat = require('dateformat');
const {Booking} = require('../models/Booking');
const { isWeekend, getDefaultTimeSlots, holidays } = require('./holidays');


const MAX_BOOKING_PER_SLOT = 7;

function getNow()
{
    //const now = new Date(moment().tz("Europe/London").format());
    
    return new Date();
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







module.exports = router;
