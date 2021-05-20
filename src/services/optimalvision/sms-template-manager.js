
const { SMSTemplate } = require('../../models/optimalvision/SMSTemplate');

const { sendSMSTemplate, GetBodySMSTemplate } = require('./sms-service');
const dateformat = require("dateformat")


const CheckAndSendSMSForCalendarAppointmentBooked = async (booking, patient) => {
    try {
        const res = await SMSTemplate.find({ sendWhenBookedCalendar: true })
        if (res && res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                if (booking.phone && booking.phone.length > 3) {
                    let parameters = []
                    try{
                        parameters = JSON.parse(res[i].parameters)
                    }catch(_err){}
                    parameters = loadParameterValues(parameters, booking, patient)
                    await sendSMSTemplate(res[i].rawText, booking.phone, parameters)
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}

const GetPreviewSMS = async (templateID, booking, patient) => {
    try {
        const res = await SMSTemplate.findOne({templateID: templateID})
        if (!res)
            return {}
        let parameters = []
        try{
            parameters = JSON.parse(res.parameters)
        }catch(_err){}
        parameters = loadParameterValues(parameters, booking, patient)
        return GetBodySMSTemplate(res.rawText, parameters)
    } catch (err) {
        console.log(err)
    }
}

const SendManualSMS = async (templateID, sendTo, booking, patient) => {
    try {
        const res = await SMSTemplate.findOne({templateID: templateID})
        if (!res)
            return {}
        let parameters = []
        try{
            parameters = JSON.parse(res.parameters)
        }catch(_err){}
        parameters = loadParameterValues(parameters, booking, patient)

        await sendSMSTemplate(res.rawText, sendTo, parameters)
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
    CheckAndSendSMSForCalendarAppointmentBooked: CheckAndSendSMSForCalendarAppointmentBooked,
    GetPreviewSMS : GetPreviewSMS,
    SendManualSMS : SendManualSMS
};