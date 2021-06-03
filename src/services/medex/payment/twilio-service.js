const {sendTextMessage} = require("./twilio-sender")
const { FormatDateFromString } = require('../../DateFormatter');


const sendPaymentLinkTextMessage = async (options) =>
{
    let message = `Dear ${options.fullname.toUpperCase()},\r\n\nWe would like to kindly ask you to follow the link below to complete the payment for the Medical Express Clinic :\r\n\n`
    message += `https://londonmedicalclinic.co.uk/medicalexpressclinic/pay/${options._id}`
    // message += `\r\nYour appointment is being held for you for four hours, please ensure that the deposit payment is made to secure the slot.`
    message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991"
    await sendTextMessage(options.phone, message) 
}

const sendThankTextMessage = async (options) =>
{
    let message = `Dear ${options.fullname.toUpperCase()},\r\n\nThank you for your payment (£${options.amount}) with the Medical Express Clinic.\r\n\n`
    message += `Please do not hesitate to contact us if we can be of any further assistance.`
    message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991"
    await sendTextMessage(options.phone, message) 
}

const sendRefundTextMessage = async (options) =>
{
    let message = `Dear ${options.fullname.toUpperCase()},\r\n\nWe would like to inform you that your payment (£${options.amount}) with the Medical Express Clinic has been refunded.\r\n\n`
    message += `Please allow 4 working days to see it in your statement.`
    message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991"
    await sendTextMessage(options.phone, message) 
}

const sendHealthScreeningConfirmationTextMessage = async (options) => {
    if (!options.timeChanged){
        return sendHealthScreeningConfirmationTextMessageNormal(options)
    }else
    {
        return sendHealthScreeningConfirmationTextMessageTimeChanged(options)
    }
} 

const sendHealthScreeningConfirmationTextMessageNormal = async (options) =>
{
    let message = `Dear ${options.fullname.toUpperCase()},\r\n\nYour appointment for Health Screening at the Medical Express Clinic is confirmed by the clinic. We look forward to welcoming you.\r\n\n`
    message += `Your booking number is "${options.bookingRef}", please have this number handy when you attend the clinic for your appointment.`
    message += `\r\n\r\nBelow is your booking information :`
    message += `\r\n- Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime}`
    message += `\r\n- Full Name : ${options.fullname}`
    message += `\r\n- Package : ${options.service}`
    if (options.notes && options.notes.length > 1)
    {
        message += `\r\n- Notes : ${options.notes}`
    }
    message += `\r\n\r\nAlso, please complete patient registration form online before attending the clinic by following this link :`
    message += `\r\nhttps://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/screening/${options._id}`
    


    message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991"
    await sendTextMessage(options.phone, message) 
}

const sendHealthScreeningConfirmationTextMessageTimeChanged = async (options) =>
{
    let message = `Dear ${options.fullname.toUpperCase()},\r\n\nYour appointment for Health Screening at the Medical Express Clinic is confirmed by the clinic. We have had to adjust your appointment time, so please carefully review your appointment details and feel free to get in touch if this time isn't convenient, we will rearrange the screening to suit your schedule. If your amended time is suitable, then we look forward to welcoming you at the clinic.\r\n\n`
    message += `Your booking number is "${options.bookingRef}", please have this number handy when you attend the clinic for your appointment.`
    message += `\r\n\r\nBelow is your booking information :`
    message += `\r\n- Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime}`
    message += `\r\n- Full Name : ${options.fullname}`
    message += `\r\n- Package : ${options.service}`
    if (options.notes && options.notes.length > 1)
    {
        message += `\r\n- Notes : ${options.notes}`
    }
    message += `\r\n\r\nAlso, please complete patient registration form online before attending the clinic by following this link :`
    message += `\r\nhttps://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/screening/${options._id}`
    


    message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991"
    await sendTextMessage(options.phone, message) 
}




module.exports = {
    sendPaymentLinkTextMessage : sendPaymentLinkTextMessage,
    sendThankTextMessage: sendThankTextMessage,
    sendRefundTextMessage: sendRefundTextMessage,
    sendHealthScreeningConfirmationTextMessage: sendHealthScreeningConfirmationTextMessage
    
};