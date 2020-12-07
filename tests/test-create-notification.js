const {Notification} = require('./../src/models/Notification');
const mongodb = require('./../src/mongodb');


mongodb();


const notificaion = new Notification({
    timeStamp : new Date(),
    text: 'Egress Connection FAILED!',
    type: 'Egress',
});

notificaion.save((err,doc) =>{

    if (err)
    {
        console.log(err);
    }
    else
    {
        console.log(doc);
    }

});