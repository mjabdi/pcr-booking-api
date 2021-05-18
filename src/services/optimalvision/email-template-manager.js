
const { EmailTemplate } = require('../../models/optimalvision/EmailTemplate');

const { sendEmailTemplate, GetBodyEmailTemplate } = require('./email-service');
const dateformat = require("dateformat")


const CheckAndSendEmailForCalendarAppointmentBooked = async (booking, patient) => {
    try {
        const res = await EmailTemplate.find({ sendWhenBookedCalendar: true })
        if (res && res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                if (booking.email && booking.email.length > 3) {
                    let parameters = []
                    try{
                        parameters = JSON.parse(res[i].parameters)
                    }catch(_err){}
                    parameters = loadParameterValues(parameters, booking, patient)
                    await sendEmailTemplate(res[i].html, res[i].subject, booking.email, parameters)
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}

const GetPreviewEmail = async (templateID, booking, patient) => {
    try {
        const res = await EmailTemplate.findOne({templateID: templateID})
        if (!res)
            return {}
        let parameters = []
        try{
            parameters = JSON.parse(res.parameters)
        }catch(_err){}
        parameters = loadParameterValues(parameters, booking, patient)
        return GetBodyEmailTemplate(res.html, res.subject, parameters)
    } catch (err) {
        console.log(err)
    }
}

const SendManualEmail = async (templateID, sendTo, booking, patient) => {
    try {
        const res = await EmailTemplate.findOne({templateID: templateID})
        if (!res)
            return {}
        let parameters = []
        try{
            parameters = JSON.parse(res.parameters)
        }catch(_err){}
        parameters = loadParameterValues(parameters, booking, patient)
        await sendEmailTemplate(res.html, res.subject, sendTo, parameters)
    } catch (err) {
        console.log(err)
    }
}



function loadParameterValues (parameters, booking, patient) {
    let result = []
    parameters.forEach(element => {
        if (element.builtinValue === "Patient Name"){
            let value = ''
            if (patient)
            {
                value = patient.name
            }else if (booking){
                value = booking.fullname.substr(0, booking.fullname.indexOf(" "))
            }
            result.push({...element, value: value})
        }else if (element.builtinValue === "Patient Surname"){
            let value = ''
            if (patient)
            {
                value = patient.surname
            }else if (booking){
                value = booking.fullname.substr(booking.fullname.indexOf(" "))
            }
            result.push({...element, value: value})

        }else if (element.builtinValue === "Patient Fullname"){
            let value = ''
            if (patient)
            {
                value = `${patient.name} ${patient.surname}`
            }else if (booking){
                value = booking.fullname
            }
            result.push({...element, value: value})
        }else if (element.builtinValue === "Today Date"){
            let value = dateformat(new Date(), 'dd-mm-yyyy')
            result.push({...element, value: value})
        }else if (element.builtinValue === "Appointment DateTime"){
            let value = ''
            if (booking)
            {
                value = `${dateformat(booking.bookingDate, 'dd-mm-yyyy')}, ${booking.bookingTime}`
            }
            result.push({...element, value: value})
        }    
    });

    return result
}

module.exports = {
    CheckAndSendEmailForCalendarAppointmentBooked: CheckAndSendEmailForCalendarAppointmentBooked,
    GetPreviewEmail : GetPreviewEmail,
    SendManualEmail : SendManualEmail
};