
const {sendTextMessage} = require("./twilio-sender")
const { FormatDateFromString } = require('../DateFormatter');
const { sendReviewEmail } = require("./email-service");


const sendManualConfirmationSMS = async (options) => {

    options.paymentLink = `https://londonmedicalclinic.co.uk/drsia/pay/${options._id}`

    let text = `Dear ${options.fullname.toUpperCase()},\r\n`
    text += `\r\nWe arranged an appointment for you with the Dental Practice (Dr. SIA) at: \r\n\r\n "${FormatDateFromString(options.bookingDate)}, ${options.bookingTime}"\r\n`
    if (options.deposit <= 0 && !options.depositNotRequired)
    {
       text += `\r\nPlease pay the £95 deposit within the next four hours to secure your appointment by following the link below :`
       text += `\r\n${options.paymentLink || '#'}\r\n`
       text += `\r\nPlease note that your deposit is refundable if you cancel your appointment, providing us with at least 48 working hours' notice.`
    }

    text +=`\r\nFollow this link if you need to modify your booking details, rearrange your appointment or cancel your booking:`
    text += `\r\nhttps://londonmedicalclinic.co.uk/drsia/user/edit/dentist/${options._id}\r\n`
    text += `\r\nKind Regards,`
    text += `\r\nDr. SIA`
    text += `\r\n02071831906`
    text += `\r\n20 Wimpole St, London W1G 8GF`

    await sendTextMessage(options.phone, text)

}

const sendPaymentReminderSMS = async (options) => {

    options.paymentLink = `https://londonmedicalclinic.co.uk/drsia/pay/${options._id}`

    let text = `Dear ${options.fullname.toUpperCase()},\r\n`
    text += `\r\nWe would like to remind you that your deposit (£95) has not been received yet.`
    text += ` Please pay the £95 deposit within the next 60 minutes to secure your appointment by following the link below :`
    text += `\r\n${options.paymentLink || '#'}\r\n`

    text +=`\r\nPlease note that your deposit is refundable if you cancel your appointment, providing us with at least 48 working hours' notice. Follow this link if you need to modify your booking details, rearrange your appointment or cancel your booking:`
    text += `\r\nhttps://londonmedicalclinic.co.uk/drsia/user/edit/dentist/${options._id}\r\n`
    text += `\r\nKind Regards,`
    text += `\r\nDr. SIA`
    text += `\r\n02071831906`
    text += `\r\n20 Wimpole St, London W1G 8GF`


    await sendTextMessage(options.phone, text)

}

const sendPaymentThanksSMS = async (options) => {

    let text = `Dear ${options.fullname.toUpperCase()},\r\n`
    text += `\r\nThank you for your payment (£95).`
    text += ` We look forward to meeting you at the clinic.`

    text +=`\r\nPlease note that your deposit is refundable if you cancel your appointment, providing us with at least 48 working hours' notice.\r\n Follow this link if you need to modify your booking details, rearrange your appointment or cancel your booking:`
    text += `\r\nhttps://londonmedicalclinic.co.uk/drsia/user/edit/dentist/${options._id}\r\n`
    text += `\r\nKind Regards,`
    text += `\r\nDr. SIA`
    text += `\r\n02071831906`
    text += `\r\n20 Wimpole St, London W1G 8GF`


    await sendTextMessage(options.phone, text)
}



const sendReviewSMS = async (options, message) => {
//   let text = `Dear ${options.fullname.toUpperCase()},\r\n`;
//   text += `${message}`;
//   await sendTextMessage(options.phone, text);

await sendReviewEmail(options, message)

};


module.exports = {
    sendManualConfirmationSMS: sendManualConfirmationSMS,
    sendPaymentReminderSMS: sendPaymentReminderSMS,
    sendPaymentThanksSMS: sendPaymentThanksSMS,
    sendReviewSMS: sendReviewSMS
};