
const {sendMail} = require('./mail-sender-2');
const {createICS} = require('./ics-creator');
const fs = require("fs")
const path = require("path");

const { FormatDateFromString } = require('../DateFormatter');


const sendConfirmationEmail =  async (options) =>
{
    const file = fs.readFileSync(path.resolve(__dirname, "./templates/email-template1.html"));
    const content = file.toString().replace('$NAME$', options.fullname)
    await sendMail(options.email, 'Appointment Confirmation - Optimal Vision', content, null);
   
}

const sendScheduledEmail =  async (options) =>
{
    const file = fs.readFileSync(path.resolve(__dirname, "./templates/email-template2.html"));
    const content = file.toString().replace('$NAME$', options.fullname).replace('$DATE$',  FormatDateFromString(options.bookingDate)).replace('$TIME$', options.bookingTime)

    await sendMail(options.email, 'Your Callback is Scheduled - Optimal Vision', content, null);
   
}

const sendNotificationEmail =  async (options) =>
{
    const file = fs.readFileSync(path.resolve(__dirname, "./templates/email-template3.html"));

    let Appointment = `${options.faceToFaceConsultation ? 'face to face consultaion' : ''} - ${options.telephoneConsultation ? 'telephone consultaion' : ''}`

    const content = file.toString().replace('$NAME$', options.fullname)
                                    .replace('$EMAIL$',  options.email)
                                    .replace('$PHONE$', options.phone)
                                    .replace('$APPOINTMENT$', Appointment)
                                    .replace('$DATE$', FormatDateFromString(options.bookingDate))
                                    .replace('$TIME$', options.bookingTime)

    const email = process.env.NODE_ENV === 'production' ? 'info@optimalvision.co.uk' : 'm.jafarabdi@gmail.com'
    // const email = "m.jafarabdi@gmail.com"
   
    await sendMail(email, `NEW BOOKING NOTIFICATION - ${options.fullname}`, content, null);
   
}





module.exports = {
    sendConfirmationEmail : sendConfirmationEmail,
    sendScheduledEmail: sendScheduledEmail,
    sendNotificationEmail: sendNotificationEmail
};