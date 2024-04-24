const { sendTextMessage } = require("../medex/payment/twilio-sender");
const { FormatDateFromString } = require("../DateFormatter");
const { sendReviewEmail } = require("./email-service");

const sendScreeningConfirmationTextMessage = async (options, to) => {
  let message = `Dear ${options.fullname.toUpperCase()},\r\n\nThank you for requesting an appointment, due to the comprehensive nature of the medical, we need to arrange some of the services prior to confirmation. As such, the Date and Time you have selected is not yet confirmed, however we will make arrangements as close to your requested dates and times as possible, the vast majority of patients are seen at their selected time or with an hours flexibility. We will get back to you very soon via email or telephone to finalise your booking.\r\n\n`;
  message += `Your booking number is "${options.bookingRef}", please have this number handy when you attend the clinic for your appointment.`;
  message += `\r\n\r\nBelow is your request details :`;
  message += `\r\n- Appointment Time : ${FormatDateFromString(
    options.bookingDate
  )} at ${options.bookingTime}`;
  message += `\r\n- Full Name : ${options.fullname}`;
  message += `\r\n- Package : ${options.service}`;
  if (options.notes && options.notes.length > 1) {
    message += `\r\n- Notes : ${options.notes}`;
  }
  if (options.paymentType === "klarna") {
    message += `\r\n- PAID VIA KLARNA ONLINE`;
  } else if (options.price == 100) {
    message += `\r\n- Deposit : £${options.deposit}`;
  } else {
    message += `\r\n- PAID IN FULL ONLINE`;
  }
  if (options.price) {
    message += `\r\n- Price for Requested Services : £${options.price}`;
  }

  message += "\r\n\nKind Regards,\r\nMedical Express Clinic\r\n02074991991";
//   console.log("message:", message);
  await sendTextMessage(to, message);
};

const sendReviewSMS = async (options, message) => {
  // let text = `Dear ${options.fullname.toUpperCase()},\r\n`;
  // text += `${message}`;

  // // console.log(text)

  // await sendTextMessage(options.phone, text);

  await sendReviewEmail(options);
};

module.exports = {
  sendScreeningConfirmationTextMessage: sendScreeningConfirmationTextMessage,
  sendReviewSMS: sendReviewSMS,
};
