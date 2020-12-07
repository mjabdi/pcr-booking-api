const config = require('config');

const accountSid = config.TwilioAccount; 
const authToken = config.TwilioToken; 
const client = require('twilio')(accountSid, authToken); 
 

const sendTextMessage = (to, text) =>
{
    return new Promise( (resolve, reject) => {

        client.messages 
        .create({  
           from: config.TwilioNumber,
           to: to ,
           body: text
         }) 
        .then(message => resolve(message.sid))
        .catch(err => reject(err))
        .done();
    });
}

module.exports = {
    sendTextMessage : sendTextMessage
};