const { sendMail } = require("./gp/mail-sender-2");

const NOTIFY_TYPE_GP_BOOKED = 1;
const NOTIFY_TYPE_GYNAE_BOOKED = 2;
const NOTIFY_TYPE_STD_BOOKED = 3;
const NOTIFY_TYPE_GYNAE_CANCELED = 4;

const MailTo = process.env.NODE_ENV === 'production' ? 'info@medicalexpressclinic.co.uk' : 'm.jafarabdi@gmail.com'

const sendAdminNotificationEmail = async (notifyType, booking) => {
  try {
    const subject = `Admin Notification : ${createSubject(notifyType)}`;
    const message = createMessage(notifyType, booking)

    let targetPortal = `https://londonmedicalclinic.co.uk/medicalexpressclinic/admin`;
    const butonStylePortal = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #3cc9e8 5%, #00a1c5  100%);background-color:#3cc9e8;border-radius:6px;border:1px solid #3cc9e8;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`


    let content = ''

    content += '<div style="font-size:16px;">'

    content += `<p>${message}</p>`
    if (notifyType === NOTIFY_TYPE_GYNAE_CANCELED && booking.deposit > 0)
    {
        content += `<p>You need to refund the deposit in the Admin Console.</p>` 
    }
  
    content += `<p>You can see more details via the Admin Console by following the link below: </p>` 
    content += `<p> <a href="${targetPortal}" style="${butonStylePortal}" target="_blank"> Enter Admin Console </a></p>`;
    
    content += `<p style="font-size:14px;margin-top:50px">* This message is automatically created by the system, please don't reply to this email.</p>` 


    content += '</div>'

    await sendMail(MailTo,subject,content,null)
    

  } catch (err) {
    console.log(err);
  }
};

function createSubject(notifyType) {
  switch (notifyType) {
    case NOTIFY_TYPE_GP_BOOKED:
      return "New Booking for GP";
    case NOTIFY_TYPE_GYNAE_BOOKED:
      return "New Booking for GYNAE";
    case NOTIFY_TYPE_STD_BOOKED:
      return "New Booking for STD";
    case NOTIFY_TYPE_GYNAE_CANCELED:
      return "GYNAE Canceled";
    default:
      return "";
  }
}

function createMessage(notifyType, booking) {
    switch (notifyType) {
      case NOTIFY_TYPE_GP_BOOKED:
        return `You have a new booking for <strong>GP</strong> with REF#: <strong>${booking.bookingRef}</strong>`;
      case NOTIFY_TYPE_GYNAE_BOOKED:
        return `You have a new booking for <strong>Gynae</strong> with REF#: <strong>${booking.bookingRef}</strong>`;
      case NOTIFY_TYPE_STD_BOOKED:
        return `You have a new booking for <strong>STD</strong> with REF#: <strong>${booking.bookingRef}</strong>`;
      case NOTIFY_TYPE_GYNAE_CANCELED:
        return `You have a new <strong>canceled</strong> appointment for <strong>Gynae</strong> with REF#: <strong>${booking.bookingRef}</strong>`;
      default:
        return "";
    }
  }

module.exports = {
  sendAdminNotificationEmail: sendAdminNotificationEmail,
  NOTIFY_TYPE: {
    NOTIFY_TYPE_GP_BOOKED,
    NOTIFY_TYPE_GYNAE_BOOKED,
    NOTIFY_TYPE_STD_BOOKED,
    NOTIFY_TYPE_GYNAE_CANCELED,
  },
};
