
const {Notification} = require('./../models/Notification');
const mongodb = require('./../mongodb');
const { sendTextMessage } = require("./twilio-sender");

mongodb().then( () => 
    {
        log('waiting for new notifications....');
    });



const numbers = [
    '+989126972729',
    '+447701007261'
];

const timer = setInterval(() => {
    sendNotifications();
}, 30 * 1000);

async function sendNotifications()
{
    try
    {
        const newNotifications = await Notification.find({ sent : {$ne : true}}).exec();
        if (newNotifications && newNotifications.length > 0)
        {
            for (var i = 0; i < newNotifications.length; i++)
            {
                const notification = newNotifications[i];
    
                for (var j = 0; j < numbers.length; j++)
                {
                    sendTextMessage(numbers[j],`You have an Alert from PCR-BOT : \n\n ${notification.text}` );
                    log(`Message : {"${notification.text}"} sent to ${numbers[j]}`);
                }
                
                await Notification.updateOne({_id: notification._id}, {sent : true, sentTimeStamp: new Date()});
            }

            log('waiting for new notifications....');   
        }
    }catch(err)
    {
        log(`Error : ${err}'`);
    }
}

function log(text)
{
    console.log(`${new Date().toUTCString()} : ${text}`);
}