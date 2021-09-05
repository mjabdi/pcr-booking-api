const mongodb = require('./../mongodb');
const TimeSlot = require('./../models/TimeSlot');
const dateformat = require('dateformat');
const {Booking} = require('../models/Booking');
const {Link} = require('./../models/link');
const config = require('config');
const path = require('path')
const sendMail = require('./../mail-sender')


const mailTo = "steve@medicalexpressclinic.co.uk";
const mailTo2 = "m.jafarabdi@gmail.com";


(async () => {

    const today = new Date()
    const date = new Date(today.getTime() - 24 * 60 * 60 * 1000 ); 
    const dateStr = dateformat(date, 'dd-mm-yyyy');
    const startDate = new Date(date.getFullYear() , date.getMonth() , date.getDate() , 0,0,0,0);
    const endDate = new Date(date.getFullYear(), date.getMonth() , date.getDate() , 23,59,59,99);

    await mongodb();

    const _bookings = await Link.aggregate([
      
        {"$lookup": {
            "from": "bookings",
            "localField": "filename",
            "foreignField": "filename",
            "as": "R"
          }},
          {"$unwind": "$R"},
          {"$match": {
            "$and": [
              {"isPCR": true},
              {"timeStamp": {$gt : startDate}},
              {"timeStamp":  {$lt : endDate}}
          ]}},
    ]);

    // console.log(dateStr)

    bookings = _bookings.filter((row) => row.birthDate === row.R.birthDate)

    // console.log(bookings)

    

    if (!bookings || bookings.length === 0)
    {
        process.exit(0)
        return
    }

    let html = `<div id="BookingInfo">`;
    html += `<table width="50%" cellpadding="2px" cellspacing="2px" style="min-width:50%;">`;
    html += '<thead>';
    html += '<tr style="padding:10px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;line-height:30px;text-align:center;background-color:#00a671;color:#fff;border: 1px solid #4d90e3">';
 
    html += '<th style="padding:10px" align="center"> # </th>';
    html += '<th style="padding:10px" align="center"> PATIENT NAME </th>';
    html += `<th style="padding:10px" align="center"> RESULT </th>`;
    html += `<th style="padding:10px" align="center"> TURNAROUND TIME (Hours) </th>`;

    html += `</tr>`;
    html += '</thead>';

    html += '<tbody>';

    bookings.forEach( (row,index) => {

       if (row.result.toUpperCase() === "POSITIVE")
       {
            html += `<tr style="padding:10px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;text-align:center;background-color:#f1f1f1;color:red;border: 1px solid #4d90e3">`;
       }else
       {
        html += `<tr style="padding:10px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;text-align:center;background-color:#f1f1f1;color:#333;border: 1px solid #4d90e3">`;
       } 

       const delay = parseInt(
        (row.timeStamp - row.R.samplingTimeStamp) / (3600 * 1000)
      );


       html += `<td style="padding:10px" valign="middle" > ${index+1} </td>`;
       html += `<td style="padding:10px" valign="middle" > ${row.R.forenameCapital} ${row.R.surnameCapital} </td>`;
       html += `<td style="padding:10px" valign="middle" > ${row.result.toUpperCase()} </td>`;
       html += `<td style="padding:10px" valign="middle" > ${delay.toFixed(0)} </td>`;
       html += `</tr>`;
    });
    
    html += '</tbody>';

    html += '</table> </div>';

    


   await sendMail(mailTo, `PCR TURNAROUND-TIME REPORT - ${dateStr}`, html, null)
   await sendMail(mailTo2, `PCR TURNAROUND-TIME REPORT - ${dateStr}`, html, null)
   


    
    process.exit(0)

})();

