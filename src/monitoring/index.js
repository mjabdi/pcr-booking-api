const TrustedComms = require("twilio/lib/rest/preview/TrustedComms");
const {Notification} = require('./../models/Notification');
const mongodb = require('./../mongodb');
const { sendTextMessage } = require("./twilio-sender");

mongodb();

const numbers = [
    '+989126972729',
    // '+447701007261'
];

const timer = setInterval(() => {
    sendNotifications();
}, 30 * 1000);

async function sendNotifications()
{
    const newNotifications = await Notification.find({ sent : {$ne : true}}).exec();
    if (newNotifications && newNotifications.length > 0)
    {
        for (var i = 0; i < newNotifications.length; i++)
        {
            const notification = newNotifications[i];

            for (var j = 0; j < numbers.length; j++)
            {
                sendTextMessage(numbers[j],notification.text);
                console.log(`${new Date().to}`)
            }

        }

    }


}