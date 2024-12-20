
const {sendMail} = require('./mail-sender-2');
const {createICS} = require('./ics-creator');


const { FormatDateFromString } = require('./../DateFormatter');
const uuid = require('uuid-random');

const config = require("config")


const faq = [
    {
        question: "I just booked my appointment online, should I call the clinic to confirm my appointment?",
        answer: "Please do not call to confirm appointments that have already been confirmed via email. Once you have your 9 digit code, this appointment is confirmed."
    },
    {
        question: "What will I be charged at the clinic?",
        answer: "Clinic staff will explain all the services that we will be delivered to you and their associated costs. the value of your deposit will be deducted from your total bill at the point of payment. "
    },
    {
        question: "Can I bring somebody to my appointment?",
        answer: "Yes, you can as we want all of our patients to be comfortable when using our services. Please do bear in mind that during the Coronavirus pandemic, you should consider whether it's really necessary to be accompanied as we also have trained clinic staff who will be more than happy to chaperone your appointment."
    }

];

const sendAdminNotificationEmail = async (booking) => {
    try {
      const subject = `Admin Notification : New Booking (Dr. SIA) - ${booking.fullname}`;
      const message = `You have a new booking with REF#: <strong>${booking.bookingRef}</strong> at <strong>${booking.bookingDate} , ${booking.bookingTime}</strong>`;
  
      let targetPortal = `https://londonmedicalclinic.co.uk/drsia/admin`;
      const butonStylePortal = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #0d9ba8 5%, #00909d 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`
  
      let content = "";
  
      content += '<div style="font-size:16px;">';
  
      content += `<p>${message}</p>`;

      content += `<p>Below is the booking information : </p>`;
      content += '<ul>';
      content += `<li> Appointment Time : ${FormatDateFromString(booking.bookingDate)} at ${booking.bookingTime} </li>`;
      content += `<li> Full Name : ${booking.fullname} </li>`;
      content += `<li> Telephone : ${booking.phone} </li>`;
      content += `<li> Package : ${booking.service} </li>`;
      content += `<li> Notes : ${booking.notes ? booking.notes : '-'} </li>`;
      content += `<li> Deposit : £${booking.deposit}  </li>`;
  
  
      content += `<p>You can see more details via the Admin Console by following the link below: </p>`;
      content += `<p> <a href="${targetPortal}" style="${butonStylePortal}" target="_blank"> Enter Admin Console </a></p>`;
  
      content += `<p style="font-size:14px;margin-top:50px">* This message is automatically created by the system, please don't reply to this email.</p>`;
  
      content += "</div>";

      if (process.env.NODE_ENV === "production")
      {
         await sendMail(config.DentistNotificationEmail, subject, content, null);
        //  await sendMail("matt@dubseo.co.uk", subject, content, null);
      }
  
    } catch (err) {
      console.log(err);
    }
  };



  const sendAdminNotificationEmailUpdate = async (booking) => {
    try {
      const subject = `Admin Notification : Change Booking (Dr. SIA) - ${booking.fullname}`;
      const message = `You have a change in the booking with REF#: <strong>${booking.bookingRef}</strong> at <strong>${booking.bookingDate} , ${booking.bookingTime}</strong>`;
  
      let targetPortal = `https://londonmedicalclinic.co.uk/drsia/admin`;
      const butonStylePortal = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #0d9ba8 5%, #00909d 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`
  
      let content = "";
  
      content += '<div style="font-size:16px;">';
  
      content += `<p>${message}</p>`;

      content += `<p>Below is the updated booking information : </p>`;
      content += '<ul>';
      content += `<li> Appointment Time : ${FormatDateFromString(booking.bookingDate)} at ${booking.bookingTime} </li>`;
      content += `<li> Full Name : ${booking.fullname} </li>`;
      content += `<li> Telephone : ${booking.phone} </li>`;
      content += `<li> Package : ${booking.service} </li>`;
      content += `<li> Notes : ${booking.notes ? booking.notes : '-'} </li>`;
      content += `<li> Deposit : £${booking.deposit}  </li>`;
  
  
      content += `<p>You can see more details via the Admin Console by following the link below: </p>`;
      content += `<p> <a href="${targetPortal}" style="${butonStylePortal}" target="_blank"> Enter Admin Console </a></p>`;
  
      content += `<p style="font-size:14px;margin-top:50px">* This message is automatically created by the system, please don't reply to this email.</p>`;
  
      content += "</div>";

      if (process.env.NODE_ENV === "production")
      {
         await sendMail(config.DentistNotificationEmail, subject, content, null);
        //  await sendMail("matt@dubseo.co.uk", subject, content, null);
      }
  
    } catch (err) {
      console.log(err);
    }
  };



  const sendAdminNotificationEmailCancel = async (booking) => {
    try {
      const subject = `Admin Notification : Cancel Booking (Dr. SIA) - ${booking.fullname}`;
      const message = `You have a cancellation booking with REF#: <strong>${booking.bookingRef}</strong> at <strong>${booking.bookingDate} , ${booking.bookingTime}</strong>`;
  
      let targetPortal = `https://londonmedicalclinic.co.uk/drsia/admin`;
      const butonStylePortal = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #0d9ba8 5%, #00909d 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`
  
      let content = "";
  
      content += '<div style="font-size:16px;">';
  
      content += `<p>${message}</p>`;

      content += `<p>Below is the booking information which is cancelled : </p>`;
      content += '<ul>';
      content += `<li> Appointment Time : ${FormatDateFromString(booking.bookingDate)} at ${booking.bookingTime} </li>`;
      content += `<li> Full Name : ${booking.fullname} </li>`;
      content += `<li> Telephone : ${booking.phone} </li>`;
      content += `<li> Package : ${booking.service} </li>`;
      content += `<li> Notes : ${booking.notes ? booking.notes : '-'} </li>`;
      content += `<li> Deposit : £${booking.deposit}  </li>`;
  
  
      content += `<p>You can see more details via the Admin Console by following the link below: </p>`;
      content += `<p> <a href="${targetPortal}" style="${butonStylePortal}" target="_blank"> Enter Admin Console </a></p>`;
  
      content += `<p style="font-size:14px;margin-top:50px">* This message is automatically created by the system, please don't reply to this email.</p>`;
  
      content += "</div>";

      if (process.env.NODE_ENV === "production")
      {
         await sendMail(config.DentistNotificationEmail, subject, content, null);
        //  await sendMail("matt@dubseo.co.uk", subject, content, null);
      }
  
    } catch (err) {
      console.log(err);
    }
  };

  


const sendConfirmationEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    // content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p>Thank you for booking your appointment online. We look forward to welcoming you.</p>`;
    // content += `<p style="font-size:18px; font-weight:800">‘If you have received this email your appointment is confirmed. Please <u>DON'T CALL</u> the clinic to confirm your appointment.’</p>`;

    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please have this number handy when you attend the clinic for your appointment.</p>`;
   
    const target = `https://londonmedicalclinic.co.uk/drsia/user/edit/dentist/${options._id}`;
    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #0d9ba8 5%, #00909d 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    // const targetForm = `https://londonmedicalclinic.co.uk/drsia/user/form/dentist/${options._id}`;
    // content += '<p> Also, please complete patient registration form online before attending the clinic by following this link :  </p>'
    // content += `<p> <a href="${targetForm}" style="${butonStyle}" target="_blank"> Complete Registration Form </a></p>`;


    content += `<p>Below is your booking information : </p>`;
    content += '<ul>';
    content += `<li> Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime} </li>`;
    content += `<li> Full Name : ${options.fullname} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `<li> Package : ${options.service} </li>`;
    content += `<li> Notes : ${options.notes ? options.notes : '-'} </li>`;
    if (options.deposit && options.deposit > 0)
    {
      content += `<li> Deposit : £${options.deposit}  </li>`;
    }


    content += `</ul>`;

    content += `<p> Please note that your deposit is refundable if you cancel your appointment, providing us with at least 48 working hours' notice. Follow this link if you need to modify your booking details, rearrange your appointment or cancel your booking: </p>`;


    content += `<p> <a href="${target}" style="${butonStyle}" target="_blank"> Cancel or Modify Appointment </a></p>`;
    // content += await CreatePortalLink(options.email, options.fullname)

  
    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Wimpole Dental Office</p>`;
    content += `<p style="font-weight:600">20 Wimpole Street,</p>`;
    content += `<p style="font-weight:600">London W1G 8GF</p>`;
    content += `<p style="font-weight:600">02071830357</p>`;

    content += `</div>`;
  
  
    content += '</div>'

    // content += `<div style="width:80%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // // content += `<p>PLEASE note there might be a slight delay in your appointment time (less than 10 minutes) to help maintain social distancing.</p>`;
    // content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. The clinic is located on the corner of Harley and Devonshire Streets, we have a blue door please ensure you attend the correct address for your appointment.</p>'
    // content += `<br/>`
    // content += `<i>117a Harley Street </i> <br/>`
    // content += `<i>London </i> <br/>`
    // content += `<i>W1G 6AT </i><br/>`
    // content += '<br/>'
    // content += "T - 0207 499 1991 <br/>"
    // content += "F - 0207 486 2615 <br/>"
    // content += '</div>'

    // content += `<div style="width:100%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // content += "<p>This email is confidential and is intended for the addressee only. If you are not the addressee, please delete the email and do not use it in any way. Medical Express (London) Ltd does not accept or assume responsibility for any use of or reliance on this email by anyone, other than the intended addressee to the extent agreed for the matter to which this email relates. Medical Express (London) Ltd is a Private limited Company registered in England under registered number 05078684, with its registered address at 117a Harley Street, London, W1G 6AT. It is authorised and registered with the Care Quality Commission for regulated medical activities. </p>"
    // content += `<img style="margin-left:45%" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="logo">`
    // content += "</div>"
    

    const event = await createICS(options.bookingDate, options.bookingTimeNormalized, `${options.fullname}`, options.email);

    await sendMail(options.email, 'Appointment Confirmation' , content, null);
   
}

const sendRegFormEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    // content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p> Please complete patient registration form online by following this link : </p>`;

    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #f280c4 5%, #ff9cd7 100%);background-color:#ff9cd7;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`
    const targetForm = `https://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/gynae/${options._id}`;
    
    content += `<p> <a href="${targetForm}" style="${butonStyle}" target="_blank"> Complete Registration Form </a></p>`;
  

    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Gynae Clinic</p>`;
    content += `</div>`;
  
  
    content += '</div>'

    content += `<div style="width:80%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // content += `<p>PLEASE note there might be a slight delay in your appointment time (less than 10 minutes) to help maintain social distancing.</p>`;
    content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. The clinic is located on the corner of Harley and Devonshire Streets, we have a blue door please ensure you attend the correct address for your appointment.</p>'
    content += `<br/>`
    content += `<i>117a Harley Street </i> <br/>`
    content += `<i>London </i> <br/>`
    content += `<i>W1G 6AT </i><br/>`
    content += '<br/>'
    content += "T - 0207 499 1991 <br/>"
    content += "F - 0207 486 2615 <br/>"
    content += '</div>'

    content += `<div style="width:100%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    content += "<p>This email is confidential and is intended for the addressee only. If you are not the addressee, please delete the email and do not use it in any way. Medical Express (London) Ltd does not accept or assume responsibility for any use of or reliance on this email by anyone, other than the intended addressee to the extent agreed for the matter to which this email relates. Medical Express (London) Ltd is a Private limited Company registered in England under registered number 05078684, with its registered address at 117a Harley Street, London, W1G 6AT. It is authorised and registered with the Care Quality Commission for regulated medical activities. </p>"
    content += `<img style="margin-left:45%" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="logo">`
    content += "</div>"
    
    //await sendMail(options.email, 'Registration Form for Gynae Clinic - Medical Express Clinic' , content, null);
}


const sendRefundNotificationEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    // content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p> We have processed your appointment cancelation with our Clinic : (Ref# : <strong> ${options.bookingRef}</strong>) </p>`;
    content += `<p>  <strong> Your deposit has been refunded, please allow 4 working days to see it in your statement. </strong> </p>`;


    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Dr Sia Dentistry</p>`;
    content += `</div>`;
  
  
    content += '</div>'

    // content += `<div style="width:80%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // // content += `<p>PLEASE note there might be a slight delay in your appointment time (less than 10 minutes) to help maintain social distancing.</p>`;
    // content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. The clinic is located on the corner of Harley and Devonshire Streets, we have a blue door please ensure you attend the correct address for your appointment.</p>'
    // content += `<br/>`
    // content += `<i>117a Harley Street </i> <br/>`
    // content += `<i>London </i> <br/>`
    // content += `<i>W1G 6AT </i><br/>`
    // content += '<br/>'
    // content += "T - 0207 499 1991 <br/>"
    // content += "F - 0207 486 2615 <br/>"
    // content += '</div>'

    // content += `<div style="width:100%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // content += "<p>This email is confidential and is intended for the addressee only. If you are not the addressee, please delete the email and do not use it in any way. Medical Express (London) Ltd does not accept or assume responsibility for any use of or reliance on this email by anyone, other than the intended addressee to the extent agreed for the matter to which this email relates. Medical Express (London) Ltd is a Private limited Company registered in England under registered number 05078684, with its registered address at 117a Harley Street, London, W1G 6AT. It is authorised and registered with the Care Quality Commission for regulated medical activities. </p>"
    // content += `<img style="margin-left:45%" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="logo">`
    // content += "</div>"
    
    await sendMail(options.email, 'Refund Deposit Notification' , content, null);
}


const sendManualConfirmationEmail =  async (options) =>
{

    options.paymentLink = `https://londonmedicalclinic.co.uk/drsia/pay/${options._id}`

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear ${options.fullname.toUpperCase()},</p>`;
    content += `<p>We arranged an appointment for you with the Dental Practice (Dr. SIA) : </p>`;

   
    const target = `https://londonmedicalclinic.co.uk/drsia/user/edit/dentist/${options._id}`;
    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #0d9ba8 5%, #00909d 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    const targetPay = options.paymentLink || '#'
    const butonStylePay = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #e802e5 5%, #d100ce 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:17px;font-weight:bold;padding:10px 50px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;margin-bottom:20px`


    content += '<ul>';
    content += `<li> Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime} </li>`;
    content += `<li> Full Name : ${options.fullname} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `<li> Package : ${options.service} </li>`;
    content += `<li> Notes : ${options.notes ? options.notes : '-'} </li>`;
    if (options.deposit && options.deposit > 0)
    {
      content += `<li> Deposit : £${options.deposit}  </li>`;
    }

    content += `</ul>`;

    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please have this number handy when you attend the clinic for your appointment.</p>`;


    if (options.deposit <= 0 && !options.depositNotRequired)
    {
        content += `<p style="font-weight:700;">Please pay the £95 deposit within the next four hours to secure your appointment by following the link below : </p>`;
        content += `<p> <a href="${targetPay}" style="${butonStylePay}" target="_blank"> PAY £95 DEPOSIT NOW </a></p>`;

        content += `<p> Please note that your deposit is refundable if you cancel your appointment, providing us with at least 48 working hours' notice.</p>`
    }

    content += `<p>Follow this link if you need to modify your booking details, rearrange your appointment or cancel your booking: </p>`;
    content += `<p> <a href="${target}" style="${butonStyle}" target="_blank"> Cancel or Modify Appointment </a></p>`;  


    
    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Wimpole Dental Office</p>`;
    content += `<p style="font-weight:600">20 Wimpole Street,</p>`;
    content += `<p style="font-weight:600">London W1G 8GF</p>`;
    content += `<p style="font-weight:600">02071830357</p>`;
    content += `</div>`;
  
  
    content += '</div>'

    // content += `<div style="width:80%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // // content += `<p>PLEASE note there might be a slight delay in your appointment time (less than 10 minutes) to help maintain social distancing.</p>`;
    // content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. The clinic is located on the corner of Harley and Devonshire Streets, we have a blue door please ensure you attend the correct address for your appointment.</p>'
    // content += `<br/>`
    // content += `<i>117a Harley Street </i> <br/>`
    // content += `<i>London </i> <br/>`
    // content += `<i>W1G 6AT </i><br/>`
    // content += '<br/>'
    // content += "T - 0207 499 1991 <br/>"
    // content += "F - 0207 486 2615 <br/>"
    // content += '</div>'

    // content += `<div style="width:100%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // content += "<p>This email is confidential and is intended for the addressee only. If you are not the addressee, please delete the email and do not use it in any way. Medical Express (London) Ltd does not accept or assume responsibility for any use of or reliance on this email by anyone, other than the intended addressee to the extent agreed for the matter to which this email relates. Medical Express (London) Ltd is a Private limited Company registered in England under registered number 05078684, with its registered address at 117a Harley Street, London, W1G 6AT. It is authorised and registered with the Care Quality Commission for regulated medical activities. </p>"
    // content += `<img style="margin-left:45%" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="logo">`
    // content += "</div>"
    

    // const event = await createICS(options.bookingDate, options.bookingTimeNormalized, `${options.fullname}`, options.email);

    await sendMail(options.email, 'Appointment Confirmation' , content, null);
   
}

const sendPaymentReminderEmail =  async (options) =>
{
    options.paymentLink = `https://londonmedicalclinic.co.uk/drsia/pay/${options._id}`


    var content = '';

    const target = `https://londonmedicalclinic.co.uk/drsia/user/edit/dentist/${options._id}`;
    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #0d9ba8 5%, #00909d 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    const targetPay = options.paymentLink || '#'
    const butonStylePay = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #e802e5 5%, #d100ce 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:17px;font-weight:bold;padding:10px 50px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;margin-bottom:20px`


    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear ${options.fullname.toUpperCase()},</p>`;
    content += `<p>We would like to remind you that your deposit (£95) has not been received yet.</p>`;

    content += `<p style="font-weight:700;">Please pay the £95 deposit within the next 60 minutes to secure your appointment by following the link below : </p>`;
    content += `<p> <a href="${targetPay}" style="${butonStylePay}" target="_blank"> PAY £95 DEPOSIT NOW </a></p>`;


    content += '<ul>';
    content += `<li> Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime} </li>`;
    content += `<li> Full Name : ${options.fullname} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `<li> Package : ${options.service} </li>`;
    content += `<li> Notes : ${options.notes ? options.notes : '-'} </li>`;
    if (options.deposit && options.deposit > 0)
    {
      content += `<li> Deposit : £${options.deposit}  </li>`;
    }

    content += `</ul>`;

    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please have this number handy when you attend the clinic for your appointment.</p>`;



    content += `<p> Please note that your deposit is refundable if you cancel your appointment, providing us with at least 48 working hours' notice. Follow this link if you need to modify your booking details, rearrange your appointment or cancel your booking: </p>`;
    content += `<p> <a href="${target}" style="${butonStyle}" target="_blank"> Cancel or Modify Appointment </a></p>`;
    
    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Wimpole Dental Office</p>`;
    content += `<p style="font-weight:600">20 Wimpole Street,</p>`;
    content += `<p style="font-weight:600">London W1G 8GF</p>`;
    content += `<p style="font-weight:600">02071830357</p>`;
    content += `</div>`;
  
  
    content += '</div>'

    // content += `<div style="width:80%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // // content += `<p>PLEASE note there might be a slight delay in your appointment time (less than 10 minutes) to help maintain social distancing.</p>`;
    // content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. The clinic is located on the corner of Harley and Devonshire Streets, we have a blue door please ensure you attend the correct address for your appointment.</p>'
    // content += `<br/>`
    // content += `<i>117a Harley Street </i> <br/>`
    // content += `<i>London </i> <br/>`
    // content += `<i>W1G 6AT </i><br/>`
    // content += '<br/>'
    // content += "T - 0207 499 1991 <br/>"
    // content += "F - 0207 486 2615 <br/>"
    // content += '</div>'

    // content += `<div style="width:100%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // content += "<p>This email is confidential and is intended for the addressee only. If you are not the addressee, please delete the email and do not use it in any way. Medical Express (London) Ltd does not accept or assume responsibility for any use of or reliance on this email by anyone, other than the intended addressee to the extent agreed for the matter to which this email relates. Medical Express (London) Ltd is a Private limited Company registered in England under registered number 05078684, with its registered address at 117a Harley Street, London, W1G 6AT. It is authorised and registered with the Care Quality Commission for regulated medical activities. </p>"
    // content += `<img style="margin-left:45%" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="logo">`
    // content += "</div>"
    

    // const event = await createICS(options.bookingDate, options.bookingTimeNormalized, `${options.fullname}`, options.email);

    await sendMail(options.email, 'Payment Reminder' , content, null);
   
}

const sendPaymentThanksEmail =  async (options) =>
{
    options.paymentLink = `https://londonmedicalclinic.co.uk/drsia/pay/${options._id}`


    var content = '';

    const target = `https://londonmedicalclinic.co.uk/drsia/user/edit/dentist/${options._id}`;
    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #0d9ba8 5%, #00909d 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    const targetPay = options.paymentLink || '#'
    const butonStylePay = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #e802e5 5%, #d100ce 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:17px;font-weight:bold;padding:10px 50px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;margin-bottom:20px`


    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear ${options.fullname.toUpperCase()},</p>`;
    content += `<p>Thank you for your payment (£95). We look forward to meeting you at the clinic.</p>`;


    content += '<ul>';
    content += `<li> Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime} </li>`;
    content += `<li> Full Name : ${options.fullname} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `<li> Package : ${options.service} </li>`;
    content += `<li> Notes : ${options.notes ? options.notes : '-'} </li>`;
    if (options.deposit && options.deposit > 0)
    {
      content += `<li> Deposit : £${options.deposit}  </li>`;
    }

    content += `</ul>`;

    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please have this number handy when you attend the clinic for your appointment.</p>`;



    content += `<p> Please note that your deposit is refundable if you cancel your appointment, providing us with at least 48 working hours' notice. Follow this link if you need to modify your booking details, rearrange your appointment or cancel your booking: </p>`;
    content += `<p> <a href="${target}" style="${butonStyle}" target="_blank"> Cancel or Modify Appointment </a></p>`;
    
    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Wimpole Dental Office</p>`;
    content += `<p style="font-weight:600">20 Wimpole Street,</p>`;
    content += `<p style="font-weight:600">London W1G 8GF</p>`;
    content += `<p style="font-weight:600">02071830357</p>`;
    content += `</div>`;
  
  
    content += '</div>'

    // content += `<div style="width:80%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // // content += `<p>PLEASE note there might be a slight delay in your appointment time (less than 10 minutes) to help maintain social distancing.</p>`;
    // content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. The clinic is located on the corner of Harley and Devonshire Streets, we have a blue door please ensure you attend the correct address for your appointment.</p>'
    // content += `<br/>`
    // content += `<i>117a Harley Street </i> <br/>`
    // content += `<i>London </i> <br/>`
    // content += `<i>W1G 6AT </i><br/>`
    // content += '<br/>'
    // content += "T - 0207 499 1991 <br/>"
    // content += "F - 0207 486 2615 <br/>"
    // content += '</div>'

    // content += `<div style="width:100%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // content += "<p>This email is confidential and is intended for the addressee only. If you are not the addressee, please delete the email and do not use it in any way. Medical Express (London) Ltd does not accept or assume responsibility for any use of or reliance on this email by anyone, other than the intended addressee to the extent agreed for the matter to which this email relates. Medical Express (London) Ltd is a Private limited Company registered in England under registered number 05078684, with its registered address at 117a Harley Street, London, W1G 6AT. It is authorised and registered with the Care Quality Commission for regulated medical activities. </p>"
    // content += `<img style="margin-left:45%" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="logo">`
    // content += "</div>"
    

    // const event = await createICS(options.bookingDate, options.bookingTimeNormalized, `${options.fullname}`, options.email);

    await sendMail(options.email, 'Thank You for Your Payment' , content, null);
   
}


const sendReviewEmail =  async (options, message) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%; max-width:900px; font-size: 16px;  line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear <i> ${options.fullname} </i>,</p>`;
    content += `<p style="font-weight:600;"> ${message} </p>`;

    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Wimpole Dental Office</p>`;
    content += `<p style="font-weight:600">20 Wimpole Street,</p>`;
    content += `<p style="font-weight:600">London W1G 8GF</p>`;
    content += `<p style="font-weight:600">02071830357</p>`;
    content += `</div>`;
  
  
    content += '</div>'

    
    await sendMail(options.email, 'Wimpole Dental Office - Review request' , content, null);
}




module.exports = {
    sendConfirmationEmail : sendConfirmationEmail,
    sendRegFormEmail: sendRegFormEmail,
    sendRefundNotificationEmail: sendRefundNotificationEmail,
    sendAdminNotificationEmail: sendAdminNotificationEmail,
    sendManualConfirmationEmail: sendManualConfirmationEmail,
    sendPaymentReminderEmail: sendPaymentReminderEmail,
    sendPaymentThanksEmail: sendPaymentThanksEmail,
    sendAdminNotificationEmailUpdate: sendAdminNotificationEmailUpdate,
    sendAdminNotificationEmailCancel: sendAdminNotificationEmailCancel,
    sendReviewEmail: sendReviewEmail
};