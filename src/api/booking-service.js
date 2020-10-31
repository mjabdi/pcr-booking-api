const express = require('express');
const router = express.Router();
const {Booking} = require('./../models/Booking');
const dateformat = require('dateformat');

router.post('/bookappointment', async function(req, res, next) {

    try
    {
        validateBookAppointment(req.body);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{
        const booking = new Booking(
            {
                ...req.body,
                timeStamp: new Date(),
            }
        );

        await booking.save();
        res.status(201).send({status: 'OK'});

    }catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

const validateBookAppointment = (body) => {

    if (!body.forename)
    {
        body.forename = body.firstname;
    } 
    if (!body.surname)
    {
        body.surname = body.lastname;
    } 

    console.log(body);

    if (!body.forename) 
    {    
        throw new Error('forename field not present');
    }

    if (!body.surname) 
    {
        throw new Error('surname field not present');
    }

    if (!body.title) 
    {
        throw new Error('title field not present');
    }

    if (!body.gender) 
    {
        throw new Error('gender field not present');
    }

    if (!body.email) 
    {
        throw new Error('email field not present');
    }

    if (!body.birthDate) 
    {
        throw new Error('birthDay field not present');
    }

    if (!body.phone) 
    {
        throw new Error('phone field not present');
    }

    if (!body.address) 
    {
        throw new Error('address field not present');
    }

    if (!body.postCode) 
    {
        throw new Error('postCode field not present');
    }

    if (!body.bookingDate) 
    {
        throw new Error('bookingDate field not present');
    }

    if (!body.bookingTime) 
    {
        throw new Error('bookingTime field not present');
    }

    if (!body.bookingRef) 
    {
        throw new Error('bookingTime field not present');
    }

    body.bookingDate = dateformat(body.bookingDate, 'dd-mm-yyyy');
    body.birthDate = dateformat(body.birthDate, 'dd-mm-yyyy');

    return true;
}




module.exports = router;
