const express = require("express");
const router = express.Router();
const { Client, Environment } = require("square");
const { GynaeBooking } = require("../../models/gynae/GynaeBooking");
const {sendConfirmationEmail} = require('./email-service');


const ACCESSTOKEN = "EAAAEAxDlhTfsK7_QcWlXIS8mpoNsGyWu6GOtROECsno-txpY1bnzlPtyCscFpMt" // live
// const ACCESSTOKEN = "EAAAEHpXroK4v3SCYQTdflulI8A8BlUGdy56BSVPX7-a5nicjp9dyF7ezj8iiFzm" // sandbox


const client = new Client({
  environment: Environment.Production,
  accessToken: ACCESSTOKEN
});



const paymentsApi = client.paymentsApi;
const refundsApi = client.refundsApi;

const LOCATION_ID = "L2SBNYPV0XWVJ"  // live

// const LOCATION_ID = "LBR8YPCPR878R"  // sandbox



router.post("/dopayment", async function (req, res, next) {
  try {
    const personInfo = req.body.personInfo;

    const payload = {
      sourceId: req.body.nonce,
      verificationToken: req.body.token,
      autocomplete: true,
      locationId: LOCATION_ID,
      amountMoney: {
        amount: 1 * 100,
        currency: "GBP",
      },
      idempotencyKey: personInfo.bookingRef,
    };

    try {
      validateBookAppointment(personInfo);
    } catch (err) {
      console.error(err.message);
      res.status(400).send({ status: "FAILED", error: err.message });
      return;
    }

    const found = await GynaeBooking.findOne({
      email: personInfo.email,
      bookingDate: personInfo.bookingDate,
      deleted: { $ne: true },
    });

    if (found) {
      res.status(200).send({
        status: "FAILED",
        error: "Repeated Booking!",
        person: req.body,
      });
      return;
    }

    const { result } = await paymentsApi.createPayment(payload);

    const payment = result.payment;
    console.log(payment);
    if (payment.status === "COMPLETED") {
      const {
        id,
        createdAt,
        cardDetails,
        locationId,
        orderId,
        receiptNumber,
        receiptUrl,
        totalMoney
      } = payment;
     
      const paymentInfo = JSON.stringify({
        id,
        createdAt,
        cardDetails,
        locationId,
        orderId,
        receiptNumber,
        receiptUrl,
        totalMoney,
      });

      const booking = new GynaeBooking({
        ...personInfo,
        paymentInfo: paymentInfo,
        timeStamp: new Date(),
      });

      await booking.save();

      await sendConfirmationEmail(booking);

      res.status(200).send({ status: "OK", person: personInfo });
    } else {
      res.status(500).send({ status: "FAILED" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/refundpayment", async function (req, res, next) {

    try{

        const bookingId = req.body.bookingId;
        const booking = await GynaeBooking.findOne({_id: bookingId})

        if (!booking)
        {
            res.status(200).send({ status: "FAILED", result: "Booking Not Found" });
            return
        }
        if (booking.status !== 'booked')
        {
            res.status(200).send({ status: "FAILED", result: "Invalid Booking Status" });
            return
        }

        if (!booking.paymentInfo)
        {
            res.status(200).send({ status: "FAILED", result: "Booking Not Paied" });
            return
        }

        if (booking.refund)
        {
            res.status(200).send({ status: "FAILED", result: "Already Refunded" });
            return
        }
        
        const paymentInfo =  JSON.parse(booking.paymentInfo)

        const payload = {
            idempotencyKey: booking._id.toString(),
            amountMoney: paymentInfo.totalMoney,
            paymentId: paymentInfo.id,
            autocomplete: true
        }

        const { result } = await refundsApi.refundPayment(payload);

        if (result && result.refund && result.refund.id)
        {
            booking.refund = JSON.stringify(result.refund)
            await booking.save()
        }

        res.status(200).send({ status: "OK" });

    }
    catch(err){
        console.log(err);
        res.status(500).send({ status: "FAILED", error: err.message });
    }

});




const validateBookAppointment = (body) => {

    console.log(body);

    if (!body.fullname) 
    {    
        throw new Error('fullname field not present');
    }

    if (!body.email) 
    {
        throw new Error('email field not present');
    }

    if (!body.phone) 
    {
        throw new Error('phone field not present');
    }

    if (!body.service) 
    {
        throw new Error('service field not present');
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
        throw new Error('bookingRef field not present');
    }


    body.bookingTimeNormalized = NormalizeTime(body.bookingTime);

    return true;
}

function NormalizeTime(str)
{
    var hour = parseInt(str.substr(0,2));
    const minutesStr = str.substr(3,2);
    const isPM = str.toLowerCase().indexOf('pm') > 0;

    if (isPM && hour < 12)
    {
        hour += 12;
    }

    if (!isPM && hour === 12)
    {
        hour = 0;
    }

    var hourStr = `${hour}`;
    if (hourStr.length < 2)
        hourStr = `0${hourStr}`;

    return `${hourStr}:${minutesStr}`;    
}


module.exports = router;
