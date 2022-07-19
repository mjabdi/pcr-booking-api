
const {sendTextMessage} = require("../medex/payment/twilio-sender")
const { FormatDateFromString } = require('../DateFormatter');


const sendGynaeConfirmationTextMessage = async (options, to) =>
{
    let message = `Dear ${options.fullname.toUpperCase()},\r\n\nThank you for booking your appointment for Gynae Clinic at the Medical Express Clinic. We look forward to welcoming you.\r\n\n`
    message += `Your booking number is "${options.bookingRef}", please have this number handy when you attend the clinic for your appointment.`
    message += `\r\n\r\nBelow is your booking information :`
    message += `\r\n- Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime}`
    message += `\r\n- Full Name : ${options.fullname}`
    message += `\r\n- Package : ${options.service}`;
    if (options.notes && options.notes.length > 1)
    {
        message += `\r\n- Notes : ${options.notes}`
    }

    message += `\r\n- Deposit : £${options.deposit}`;




    message += `\r\nFollow this link if you need to modify your booking details, rearrange your appointment or cancel your booking :`;
    message += `\r\nhttps://londonmedicalclinic.co.uk/medicalexpressclinic/user/edit/gynae/${options._id}`;




    message += `\r\n\r\nAlso, please complete patient registration form online before attending the clinic by following this link :`
    message += `\r\nhttps://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/gynae/${options._id}`
    


    message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991"
    await sendTextMessage(to, message) 
}


module.exports = {
    sendGynaeConfirmationTextMessage: sendGynaeConfirmationTextMessage,
};