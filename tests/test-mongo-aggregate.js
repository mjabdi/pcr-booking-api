const mongodb = require('./../src/mongodb');
const TimeSlot = require('./../src/models/TimeSlot');
const dateformat = require('dateformat');
const {Booking} = require('../src/models/Booking');
const config = require('config');

(async () => {

    config.MongodbUrl =  "mongodb+srv://dbadmin:Bahar$bahar$1@cluster0.s4l29.mongodb.net/PCRTest?retryWrites=true&w=majority";

    await mongodb();
    const date = '2020-11-21';
    
    const result = await Booking.aggregate([
        {
            $match: {
              bookingDate: date
            }
          },

          { $group:
             {
                 "_id" : {
                    "bookingTime" : "$bookingTime",
                    "bookingRef": "$bookingRef"

                 } ,
                 "bookCount": { "$sum" : 1 }               
            } 
        } ,

        { $group:
            {
                _id : "$_id.bookingTime",
                total : { $sum: 1 }               
           } 
       },

     ]);

     console.log(result);
    


})();