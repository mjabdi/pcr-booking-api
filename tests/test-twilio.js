
const accountSid = 'AC318509cc35ae905a151a8bbd0b815207'; 
const authToken = '3364aefc741b5dcbc1552776910babb2'; 
const client = require('twilio')(accountSid, authToken); 
 


const sendTextMessage = (to, text) =>
{
    return new Promise( (resolve, reject) => {

        client.messages 
        .create({  
           from: '+12056913623',
           to: to ,
           body: text
         }) 
        .then(message => resolve(message.sid))
        .catch(err => reject(err))
        .done();
    });
}

(async () => {

   const result = await sendTextMessage('+447701007261', 'Hi Mehdi, this is just a test message!');
   console.log(result);

   process.exit(0);

})();     
    
       