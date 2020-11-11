const {sendMail} = require('./../src/mail-sender-2');
const {createICS} = require('./../src/ics-creator');


(async () => {

    const ics = await createICS();
    console.log(ics);

    const event =  {
        filename: 'invitation.ics',
        method: 'request',
        content: ics
    };
   

    const result = await sendMail('m.jafarabdi@gmail.com', 'test with ical', '<h1> Hello Mohammad</h1>', event);
   console.log(result);



})();