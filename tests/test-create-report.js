const mongodb = require('./../src/mongodb');
const TimeSlot = require('./../src/models/TimeSlot');
const dateformat = require('dateformat');
const {Booking} = require('../src/models/Booking');
const {Link} = require('./../src/models/link');
const config = require('config');

(async () => {

    config.MongodbUrl =  "mongodb+srv://dbadmin:Bahar$bahar$1@cluster0.s4l29.mongodb.net/PCRTest?retryWrites=true&w=majority";

    await mongodb();
   
    // const bookings = await Booking.find({$and: [{$or: [{status: 'report_sent'}, {status: 'report_cert_sent'}]} , {samplingTimeStamp : {$ne : null}}]});
    const bookings = await Booking.find({$or: [{status: 'report_sent'}, {status: 'report_cert_sent'}]});

    const result = [];

    for (var i = 0; i < bookings.length ; i++)
    {
        let booking = bookings[i];

        if (!booking.samplingTimeStamp)
        {
            booking.samplingTimeStamp = createTimeStampFromBookingDate(booking.bookingDate, booking.bookingTime);
        }

        const link = await Link.findOne({filename: booking.filename});

        const delay = parseInt((link.timeStamp - booking.samplingTimeStamp) / (3600*1000));

        result.push({id : booking._id, testTime: dateformat(booking.samplingTimeStamp,"dddd, mmmm dS, yyyy, h:MM:ss TT" ),resultTime: dateformat(link.timeStamp, "dddd, mmmm dS, yyyy, h:MM:ss TT"), delay: delay});

    }


    console.log(result);
  
})();

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