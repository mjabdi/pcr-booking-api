
const {sendTextMessage} = require("./twilio-sender")
const { FormatDateFromString } = require('../DateFormatter');


const sendManualConfirmationSMS = async (options) => {
    let text = `Dear ${options.fullname.toUpperCase()},\r\n`
    text += `\r\nWe arranged an appointment for you with the Dental Practice (Dr. SIA) at: \r\n\r\n "${FormatDateFromString(options.bookingDate)}, ${options.bookingTime}"\r\n`
    if (options.deposit <= 0)
    {
       text += `\r\nPlease pay the £95 deposit within the next four hours to secure your appointment by following the link below :`
       text += `\r\n${options.paymentLink || '#'}\r\n`
    }

    text +=`\r\nPlease note that your deposit is refundable if you cancel your appointment, providing us with at least 48 hours' notice. Follow this link if you need to modify your booking details, rearrange your appointment or cancel your booking:`
    text += `\r\nhttps://londonmedicalclinic.co.uk/drsia/user/edit/dentist/${options._id}\r\n`
    text += `\r\nKind Regards,`
    text += `\r\nDental Clinic`
    text += `\r\n02071831906`

    await sendTextMessage(options.phone, text)

}

const sendReminderSMS = async (options) => {


}



module.exports = {
    sendManualConfirmationSMS: sendManualConfirmationSMS
};