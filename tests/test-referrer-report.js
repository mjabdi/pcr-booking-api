const mongodb = require('./../src/mongodb');
const TimeSlot = require('./../src/models/TimeSlot');
const dateformat = require('dateformat');
const {Booking} = require('../src/models/Booking');
const config = require('config');
const sendMail = require('./../src/mail-sender');

(async () => {

    config.MongodbUrl =  "mongodb+srv://dbadmin:Bahar$bahar$1@cluster0.s4l29.mongodb.net/PCRTest?retryWrites=true&w=majority";
    config.MailAccount = "m.jafarabdi2@gmail.com";
    config.MailPassword = "baqimhtprmkkhepl";

    await mongodb();
    const date = new Date(new Date().getTime() - 86400000); 
    const startDate = new Date(date.getFullYear(), date.getMonth() , date.getDate(), 0,0,0,0);
    const endDate = new Date(date.getFullYear(), date.getMonth() , date.getDate(), 23,59,59,0);

    
    const result = await Booking.aggregate([
         {
            $match: {
              $and:[ {referrer : { $ne: null}} , {referrer : { $ne: '/'}} , {$and: [{timeStamp : {$gt : startDate}},{timeStamp : {$lt : endDate}}]}]  
              
            }
          },

          { $group:
             {
                 "_id" : "$referrer",
                
                 "count": { "$sum" : 1 }               
            } 
        } ,

     
     ]).sort({"count" : -1}).exec();

     var html = `<div id="BookingInfo">`;
     html += `<table width="50%" cellpadding="2px" cellspacing="2px" style="min-width:50%;">`;
     html += '<thead>';
     html += '<tr style="padding:10px; font-family: Arial,sans-serif; font-size: 18px; line-height:20px;line-height:30px;text-align:center;background-color:#00479e;color:#fff;border: 1px solid #4d90e3">';
     html += '<th  align="center"> Website </th>';
     html += `<th  align="center"> Booking Count </th>`;
     html += `</tr>`;
     html += '</thead>';

     html += '<tbody>';

     result.forEach( row => {

        html += `<tr style="padding:10px; font-family: Arial,sans-serif; font-size: 18px; line-height:20px;text-align:center;background-color:#f1f1f1;color:#333;border: 1px solid #4d90e3">`;
        html += `<td valign="middle" > ${row._id} </td>`;
        html += `<td valign="middle" > ${row.count} </td>`;
        html += `</tr>`;
     });
     
     html += '</tbody>';

     html += '</table> </div>';

     await sendMail('matt@dubseo.co.uk', `PCR BOOKING REPORTS - ${dateformat(date, 'dd/mm/yyyy')}`, html, null);
     await sendMail('m.jafarabdi@gmail.com', `PCR BOOKING REPORTS - ${dateformat(date, 'dd/mm/yyyy')}`, html, null);

     console.log(result);

     process.exit(0);


})();