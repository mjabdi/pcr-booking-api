const config = require('config');
const {sendTextMessage} = require("./twilio-sender")

const RyanCarpetVOIPNo = "442080502312"
const DrSiaVOIPNo = "442080502148"
const MedexVOIPNo = "442080502312"
const OVVOIPNo = "442080503276"
const GynaeVOIPNo = "442080501707"
const HealthScrVOIPNo = "442080502869"

const WasteRemovalVOIPNo = "442080506364"
const PaintWorksVOIPNO = "442080501927"
const DentalPracticeTurkey = "442080504356"

const GlaziersVOIPNO = "442080504236"




const minCallDuration = 0

const callended = async (body) => {

    const {uuid, call_type, from_type, from, to_type, to, start, end, duration, answer_type, answered_by} = body

    if (!uuid || call_type !== 'inbound' || from_type !== 'number' || !from || to_type !== 'number' || !to || !start)
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
        let messageText = `Thank you for your enquiry with Dental Clinic - home of Teeth Whitening, cosmetic dentistry and emergency dentistry , Please do not hesitate to contact us on 02071830357 , should you have any further questions.`

        await sendTextMessage(from, messageText, config.DrSIATwilioNumber)
    }
    else if (to === MedexVOIPNo && duration >= minCallDuration){
        let messageText = ""

        // await sendTextMessage(from, messageText, config.MedexTwilioNumber)
    }
    else if (to === OVVOIPNo && duration >= minCallDuration){
        console.log("******** inside OVVOIPNo **************")

        let messageText = `Thank you for your enquiry with Optimal Vision , Please do not hesitate to contact us on 02071833725 , should you have any further questions - www.optimalvision.co.uk`

        await sendTextMessage(from, messageText, config.OptimalVisionTwilioNumber)
    }
    else if (to === GynaeVOIPNo && duration >= minCallDuration){
        let messageText = `Thank you for your enquiry with Gynae Clinic, Please do not hesitate to contact us on 02071830435 , or send us an email at info@gynae-clinic.go.uk should you have any further questions - www.gynae-clinic.co.uk`

        await sendTextMessage(from, messageText, config.MedexTwilioNumber)
    }
    else if (to === HealthScrVOIPNo && duration >= minCallDuration){
        let messageText = `Thank you for your enquiry with Health Screening, Please do not hesitate to contact us on 02071837056 , or send us an email at info@healthscreening.clinic should you have any further questions or difficulty getting through today - www.healthscreening.clinic`

        await sendTextMessage(from, messageText, config.MedexTwilioNumber)
    }
    else if (to === WasteRemovalVOIPNo && duration >= minCallDuration){
        console.log("******** inside WasteRemovalVOIPNo **************")
        let messageText = `Thank you for your enquiry with Waste/Junk and Rubbish removal London , Please do not hesitate to contact us on 07907603848 , or send us a WhatsApp should you have any further questions.`
        const result = await sendTextMessage(from, messageText, "+447700174944")
        console.log(result)
    }    
    else if (to === PaintWorksVOIPNO && duration >= minCallDuration){
        let messageText = `Thank you for your enquiry with Paint Works London, Home of Painting and decorating, Please do not hesitate to contact us on  020 71833809, WhatsApp 07703696456 or send us an email at info@paintworkslondon.co.uk should you have any further questions  www.paintworkslondon.co.uk`
        await sendTextMessage(from, messageText, "+447700158730")
    }    
    else if (to === DentalPracticeTurkey && duration >= minCallDuration){
        let messageText = `Thank you for your enquiry with Dental Practice Turkey, Home of Veneers, Implants and cosmetic dentistry, Please do not hesitate to contact us on  020 34758235, WhatsApp +905545814094 should you have any further questions.`
        await sendTextMessage(from, messageText, "+447723487796")
    }  
    else if (to === GlaziersVOIPNO && duration >= minCallDuration){
        let messageText = `Thank you for your enquiry with Glaziers, Home of Glazing, Window repairs and emergency boarding, Please do not hesitate to contact us on  07796433883, WhatsApp https://wa.me/+447796433883 should you have any further questions.`
        await sendTextMessage(from, messageText, "+447723503065")
    }    

}

module.exports = {
    callended: callended
}