
const {sendTextMessage} = require("../medex/payment/twilio-sender")
const { FormatDateFromString } = require('../DateFormatter');


const sendBloodConfirmationTextMessage = async (options, to) =>
{
    let message = `Dear ${options.fullname.toUpperCase()},\r\n\nThank you for booking your appointment for Blood Test at the Medical Express Clinic. We look forward to welcoming you.\r\n\n`
    message += `Your booking number is "${options.bookingRef}", please have this number handy when you attend the clinic for your appointment.`
    message += `\r\n\r\nBelow is your booking information :`
    message += `\r\n- Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime}`
    message += `\r\n- Full Name : ${options.fullname}`
    message += `\r\n- Date of Birth : ${options.birthDate ? FormatDateFromString(options.birthDate) : '-'}`;
    message += `\r\n- Package : ${options.packageName ? options.packageName : '-'}`

    if (options.notes && options.notes.length > 1)
    {
        message += `\r\n- Notes : ${options.notes}`
    }

    if (options.IndividualTests)
    {
        const tests = JSON.parse(options.IndividualTests)
        let testsString = ''
        tests.forEach(item => {
            testsString += item.description
            testsString += ' , '
        } )
        message += `\r\n- Individual Tests : ${testsString}`;
    }   
    
    if (options.doctorConsultation)
    {
        message += `\r\n+ Full Doctor Consultation`;

    }
    
    message += `\r\n- Estimated Price : ${options.estimatedPrice}`;


    message += `\r\nFollow this link if you need to modify your booking details, rearrange your appointment or cancel your booking :`;
    message += `\r\nhttps://londonmedicalclinic.co.uk/medicalexpressclinic/user/edit/blood/${options._id}`;




    message += `\r\n\r\nAlso, please complete patient registration form online before attending the clinic by following this link :`
    message += `\r\nhttps://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/blood/${options._id}`
    


    message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991"
    await sendTextMessage(to, message) 
}


module.exports = {
    sendBloodConfirmationTextMessage: sendBloodConfirmationTextMessage,
};