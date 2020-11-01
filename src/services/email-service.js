const sendMail = require('./../mail-sender');


const sendEmail =  (options) =>
{
    var content = `Dear ${options.forename}, <br/><br/>`;
    content += `Thank you for your booking at the Meical Express Clinic.<br/><br/>`;
    content += `Your booking number is "${options.bookingRef}", please keep this number when you attend at the clinic.<br/><br/>`;
    content += `Below is your booking information : <br/><br/>`;
    content += `Appointment Time : ${options.bookingDate} at ${options.bookingTime} <br/>`;
    content += `Forename : ${options.forename} <br/>`;
    content += `Lastname : ${options.lastname} <br/>`;
    content += `Date of Birth : ${options.birthDate} <br/>`;
    content += `Address : ${options.address} <br/>`;
    content += `Telephone : ${options.phone} <br/>`;
    content += `<br/>`;
    content += `Kind Regards,<br/>`;
    content += `Medical Express Clinic,<br/>`;

    sendMail(options.email, `Your Booking Information`, content,null).then( ()=>
    {
        
    }).catch( (err) =>
    {
        console.error(err);
    });
}

module.exports = sendEmail;