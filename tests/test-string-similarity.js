const mongodb = require('./../src/mongodb');
const {Booking} = require('../src/models/Booking');
const {Link} = require('./../src/models/link');
const config = require('config');


const stringSimilarity = require('string-similarity');

(async () => {

    config.MongodbUrl =  "mongodb+srv://dbadmin:Bahar$bahar$1@cluster0.s4l29.mongodb.net/PCRTest?retryWrites=true&w=majority";

    await mongodb();


    //************************************************************************** */

    const link =  await Link.findOne({_id : '5fbff1e150c4a567b8b5d535'});



    const liveRecords = await Booking.find({status : 'sample_taken'});

   

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
    const likelihood = stringSimilarity.findBestMatch(fullname, fullNameArray).bestMatch.rating;

    const matchedForename = forenameArray[matchedFullnameIndex];
    const matchedSurname = surnameArray[matchedFullnameIndex];
    var bookingMatch = [];

    bookingMatch.push({likelihood: likelihood, bookings: await Booking.find({forenameCapital : matchedForename, surnameCapital : matchedSurname})});
    bookingMatch.push({likelihood: likelihood * 0.95, bookings: await Booking.find({forenameCapital : matchedSurname , surnameCapital : matchedForename})});
    bookingMatch.push({likelihood: likelihood * 0.8, bookings: await Booking.find({surnameCapital : matchedSurname})});
    bookingMatch.push({likelihood: likelihood * 0.6, bookings: await Booking.find({forenameCapital : matchedForename})});
    bookingMatch.push({likelihood: likelihood * 0.5, bookings: await Booking.find({forenameCapital : matchedSurname})});
    bookingMatch.push({likelihood: likelihood * 0.5, bookings: await Booking.find({surnameCapital : matchedForename})});

    const result = [];

    bookingMatch.forEach(group => {
        if (group.bookings.length > 0)
        {
            group.bookings.forEach(booking => {
                if (result.findIndex(element => `${element._id}` === `${booking._doc._id}`) < 0)
                     result.push({...booking._doc, likelihood : group.likelihood});
            });
        }
    });

    console.log(result);


})();