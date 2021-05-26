const {sendTextMessage} = require("./twilio-sender")


const sendPaymentLinkTextMessage = async (options) =>
{
    let message = `Hi ${options.fullname.toUpperCase()},\r\n\nWe would like to kindly ask you to follow the link below to complete the payment for the Medical Express Clinic :\r\n\n`
    message += `https://londonmedicalclinic.co.uk/medicalexpressclinic/pay/${options._id}`
    // message += `\r\nYour appointment is being held for you for four hours, please ensure that the deposit payment is made to secure the slot.`
    message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991"
    await sendTextMessage(options.phone, message) 
}

const sendThankTextMessage = async (options) =>
{
    let message = `Hi ${options.fullname.toUpperCase()},\r\n\nThank you for your payment (£${options.amount}) with the Medical Express Clinic.\r\n\n`
    message += `Please do not hesitate to contact us if we can be of any further assistance.`
    message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991"
    await sendTextMessage(options.phone, message) 
}

const sendRefundTextMessage = async (options) =>
{
    let message = `Hi ${options.fullname.toUpperCase()},\r\n\nWe would like to inform you that your payment (£${options.amount}) with the Medical Express Clinic has been refunded.\r\n\n`
    message += `Please allow 4 working days to see it in your statement.`
    message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991"
    await sendTextMessage(options.phone, message) 
}


module.exports = {
    sendPaymentLinkTextMessage : sendPaymentLinkTextMessage,
    sendThankTextMessage: sendThankTextMessage,
    sendRefundTextMessage: sendRefundTextMessage
};