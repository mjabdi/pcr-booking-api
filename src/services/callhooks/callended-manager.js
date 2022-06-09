const config = require('config');
const {sendTextMessage} = require("./twilio-sender")

const RyanCarpetVOIPNo = "442080502312"
const DrSiaVOIPNo = "442080502148"
const MedexVOIPNo = "442080502312"
const OVVOIPNo = "442080503276"


const minCallDuration = 15

const callended = async (body) => {

    const {uuid, call_type, from_type, from, to_type, to, start, end, duration, answer_type, answered_by} = body

    if (!uuid || call_type !== 'inbound' || from_type !== 'number' || !from || to_type !== 'number' || !to || !start || !end || !duration || answer_type !== 'number' || !answered_by)
    {
        return
    }

    if (from.length !== 13 || !from.startsWith('+447'))
    {
        return
    }

    //Ryan Carpet Cleaning

    if (to === RyanCarpetVOIPNo && duration >= minCallDuration){
        let messageText = `Thank you for your enquiry with Ryan Carpet Cleaning, Please do not hesitate to contact us on 02070434316 , should you have any further questions - ryancarpetcleaning.co.uk`

        await sendTextMessage(from, messageText, config.RyanCarpetTwilioNumber)
    }
    else if (to === DrSiaVOIPNo && duration >= minCallDuration){
        let messageText = `Thank you for your enquiry with Wimpole Dental Office/London Teeth Whitening, Please do not hesitate to contact us on 02071830357 , should you have any further questions - www.london-teeth-whitening.co.uk`

        await sendTextMessage(from, messageText, config.DrSIATwilioNumber)
    }
    else if (to === MedexVOIPNo && duration >= minCallDuration){
        let messageText = ""

        // await sendTextMessage(from, messageText, config.MedexTwilioNumber)
    }
    else if (to === OVVOIPNo && duration >= minCallDuration){
        let messageText = `Thank you for your enquiry with Optimal Vision , Please do not hesitate to contact us on 02071833725 , should you have any further questions - www.optimalvision.co.uk`

        await sendTextMessage(from, messageText, config.OptimalVisionTwilioNumber)
    }

}

module.exports = {
    callended: callended
}