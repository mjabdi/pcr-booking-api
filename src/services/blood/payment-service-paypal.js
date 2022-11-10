const express = require("express");
const router = express.Router();
const { BloodBooking } = require("../../models/blood/BloodBooking");
const {
  sendConfirmationEmail,
  sendRefundNotificationEmail,
} = require("./email-service");

const { sendBloodConfirmationTextMessage } = require("./sms-service");

const { sendAdminNotificationEmail, NOTIFY_TYPE } = require('../mail-notification-service');

const DEPOSIT = 50;

router.post("/dopayment", async function (req, res, next) {
  try {
    const {personInfo, paymentInfo} = req.body;

    validateBookAppointment(personInfo);

      const booking = new BloodBooking({
        ...personInfo,
        paymentInfo: JSON.stringify(paymentInfo),
        deposit: DEPOSIT,
        timeStamp: new Date(),
      });

      await booking.save();

      try {
        await sendConfirmationEmail(booking);

        await sendAdminNotificationEmail(
          NOTIFY_TYPE.NOTIFY_TYPE_BLOOD_BOOKED,
          booking
        );

        if (booking.smsPush && booking.phone && booking.phone.length > 3) {
          let _phone = booking.phone;

          if (_phone.startsWith("07") && _phone.length === 11) {
            _phone = `+447${_phone.substr(2, 10)}`;
          } else if (_phone.startsWith("7") && _phone.length === 10) {
            _phone = `+447${_phone.substr(1, 10)}`;
          }

          if (_phone.length === 13 && _phone.startsWith("+447")) {
            await sendBloodConfirmationTextMessage(booking, _phone);
          }
        }
      } catch (err) {
        console.error("Error:" , err);
      }



    res.status(200).send({ status: "OK", person: personInfo });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/refundpayment", async function (req, res, next) {
  try {
    const bookingId = req.body.bookingId;
    const booking = await BloodBooking.findOne({ _id: bookingId });

    if (!booking) {
      res.status(200).send({ status: "FAILED", result: "Booking Not Found" });
      return;
    }
    if (booking.status !== "booked") {
      res
        .status(200)
        .send({ status: "FAILED", result: "Invalid Booking Status" });
      return;
    }

    if (!booking.paymentInfo) {
      res.status(200).send({ status: "FAILED", result: "Booking Not Paied" });
      return;
    }

    if (booking.refund) {
      res.status(200).send({ status: "FAILED", result: "Already Refunded" });
      return;
    }

    const paymentInfo = JSON.parse(booking.paymentInfo);


    const result = {
      refund : {
        test: "test"
      }
      ,

      id: "iuqewydiyqwy"
    }

    if (result && result.refund && result.refund.id) {
      booking.deposit = 0;
      booking.refund = JSON.stringify(result.refund);
      await booking.save();

      try {
        await sendRefundNotificationEmail(booking);
      } catch (err) {
        console.log(err);
      }

      res.status(200).send({ status: "OK" });
    } else {
      res.status(500).send({ status: "FAILED" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/manualrefundpayment", async function (req, res, next) {
  try {
    const bookingId = req.body.bookingId;
    const booking = await BloodBooking.findOne({ _id: bookingId });

    if (!booking) {
      res.status(200).send({ status: "FAILED", result: "Booking Not Found" });
      return;
    }
    if (booking.status !== "booked") {
      res
        .status(200)
        .send({ status: "FAILED", result: "Invalid Booking Status" });
      return;
    }

    if (booking.paymentInfo) {
      res.status(200).send({ status: "FAILED", result: "Booking Paid Online" });
      return;
    }

    booking.deposit = 0;
    booking.refund = "manual refund";
    await booking.save();

    try {
      await sendRefundNotificationEmail(booking);
    } catch (err) {
      console.log(err);
    }

    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

const validateBookAppointment = (body) => {
  console.log(body);

  if (!body.fullname) {
    throw new Error("fullname field not present");
  }

  if (!body.email) {
    throw new Error("email field not present");
  }

  if (!body.phone) {
    throw new Error("phone field not present");
  }

  // if (!body.service) {
  //   throw new Error("service field not present");
  // }

  if (!body.bookingDate) {
    throw new Error("bookingDate field not present");
  }

  if (!body.bookingTime) {
    throw new Error("bookingTime field not present");
  }

  if (!body.bookingRef) {
    throw new Error("bookingRef field not present");
  }

  body.bookingTimeNormalized = NormalizeTime(body.bookingTime);

  return true;
};

function NormalizeTime(str) {
  var hour = parseInt(str.substr(0, 2));
  const minutesStr = str.substr(3, 2);
  const isPM = str.toLowerCase().indexOf("pm") > 0;

  if (isPM && hour < 12) {
    hour += 12;
  }

  if (!isPM && hour === 12) {
    hour = 0;
  }

  var hourStr = `${hour}`;
  if (hourStr.length < 2) hourStr = `0${hourStr}`;

  return `${hourStr}:${minutesStr}`;
}


module.exports = router;
