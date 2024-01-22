const express = require('express');
const router = express.Router();
const TimeSlot = require('../../models/TimeSlot');
const dateformat = require('dateformat');
const {ScreeningBooking} = require('../../models/screening/ScreeningBooking');
const { isWeekend, getDefaultTimeSlots, getHolidays } = require('./holidays');


const MAX_BOOKING_PER_SLOT = 1;

function getNow()
{
    //const now = new Date(moment().tz("Europe/London").format());
    
    return new Date();
}


/// Get First Available Date
router.get('/getfirstavaiabledate', function(req, res, next) {

    var someDate = new Date(getNow());

    // if (isWeekend(someDate))
    // {
    //     if (someDate.getHours() >= 14)
    //     {
    //         someDate.setTime(someDate.getTime() +  (1 * 24 * 60 * 60 * 1000));
    //     }

    // }else
    // {
    //     if (someDate.getHours() >= 18)
    //     {
    //         someDate.setTime(someDate.getTime() +  (1 * 24 * 60 * 60 * 1000));
    //     }
    // }

    // var duration = 0; //In Days
    // someDate.setTime(someDate.getTime() +  (duration * 24 * 60 * 60 * 1000));

    res.send({date: someDate});
});

/// Get Fully Booked Days Date
router.get("/getfullybookeddays", async function (req, res, next) {
  const result = await getHolidays();
  res.send(result);
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
    const date = req.query.date;  //dateformat(req.query.date, 'yyyy-mm-dd');

    try{

        const defaultTimeSlots = await getDefaultTimeSlots(date);     
       
         const result2 = await ScreeningBooking.aggregate([
            {
                $match: {
                  bookingDate: date,
                  deleted: {$ne : true}
                }
              },
              {
                $unionWith: {
                  coll: "gpbookings",
                  pipeline: [
                    {
                        $match: {
                            bookingDate: date,
                            deleted: {$ne : true}
                          }
                     },
                  ],
                },
              },
              {
                $unionWith: {
                  coll: "stdbookings",
                  pipeline: [
                    {
                        $match: {
                            bookingDate: date,
                            deleted: {$ne : true}
                          }
                     },
                  ],
                },
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
