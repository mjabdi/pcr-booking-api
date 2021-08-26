
const {sendMail} = require('./mail-sender-2');
const {createICS} = require('./ics-creator');


const { FormatDateFromString } = require('../DateFormatter');
const {User} = require('../../models/User');

const uuid = require('uuid-random');
const { UserEmailMap } = require('../../models/UserEmailMap');
const CreatePortalLink = require('../PortalLinkCreator');


const faq = [
    {
        question: "I just booked my appointment online, should I call the clinic to confirm my appointment?",
        answer: "Please do not call to confirm appointments that have already been confirmed via email. Once you have your 9 digit code, this appointment is confirmed."
    },
    {
        question: "Can I bring somebody to my appointment?",
        answer: "Yes, you can as we want all of our patients to be comfortable when using our services. Please do bear in mind that during the Coronavirus pandemic, you should consider whether it's really necessary to be accompanied as we also have trained clinic staff who will be more than happy to chaperone your appointment."
    }
];

const sendPatientNotificationEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    // content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;

    content += `<p>Thank you for requesting an appointment, due to the comprehensive nature of the medical, we need to arrange some of the services prior to confirmation. As such, the Date and Time you have selected is not yet confirmed, however we will make arrangements as close to your requested dates and times as possible, the vast majority of patients are seen at their selected time or with an hours flexibility. We will get back to you very soon via email or telephone to finalise your booking.</p>`;
   
    content += `<p>Below is your request details : </p>`;
    content += '<ul>';
    content += `<li> Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime} </li>`;
    content += `<li> Full Name : ${options.fullname} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `<li> Package : ${options.service} </li>`;
    content += `<li> Notes : ${options.notes ? options.notes : '-'} </li>`;

    content += `</ul>`;

  

    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Medical Express Clinic</p>`;
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
    

    // const event = await createICS(options.bookingDate, options.bookingTimeNormalized, `${options.fullname}`, options.email);

    await sendMail(options.email, 'Health Screening Appointment Request Received - Medical Express Clinic' , content, null);
   
}

const sendConfirmationEmail =  async (options) => {
    if (!options.timeChanged)
    {
        return sendConfirmationEmailNormal(options)
    }else
    {
        return sendConfirmationEmailTimeChanged(options)
    }
}



const sendConfirmationEmailNormal =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    // content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p>Your appointment for Health Screening at the Medical Express Clinic is confirmed by the clinic. We look forward to welcoming you.</p>`;
    // content += `<p style="font-size:18px; font-weight:800">‘If you have received this email your appointment is confirmed. Please <u>DON'T CALL</u> the clinic to confirm your appointment.’</p>`;

    const targetForm = `https://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/screening/${options._id}`;
    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #f29141 5%, #f68529 100%);background-color:#f68529;border-radius:6px;border:1px solid #f68529;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please have this number handy when you attend the clinic for your appointment.</p>`;
   
    content += '<p> Also, please complete patient registration form online before attending the clinic by following this link :  </p>'
    content += `<p> <a href="${targetForm}" style="${butonStyle}" target="_blank"> Complete Registration Form </a></p>`;

   
    content += `<p>Below is your booking information : </p>`;
    content += '<ul>';
    content += `<li> Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime} </li>`;
    content += `<li> Full Name : ${options.fullname} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `<li> Package : ${options.service} </li>`;
    content += `<li> Notes : ${options.notes ? options.notes : '-'} </li>`;

    content += `</ul>`;

  
    content += '<p style="font-weight:600"> Please Read our FAQs </p>';

    faq.forEach(element => {

        content += `<p style="border-left: 4px solid #f68529; background: #eee; font-weight:600;padding-left:10px;line-height:50px"> <span style="color:#f68529;font-size:24px"> Q. </span> ${element.question} </p>`;
        content += `<p style="border-left: 4px solid #999; background: #fff; font-weight:400;color: #555;padding-left:10px;line-height:50px"> <span style="color:#555;font-size:24px"> A. </span>${element.answer} </p>`;

    });


    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Medical Express Clinic</p>`;
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
    

    const event = await createICS(options.bookingDate, options.bookingTimeNormalized, `${options.fullname}`, options.email);

    await sendMail(options.email, 'Health Screening Appointment Confirmation - Medical Express Clinic' , content, event);
   
}

const sendConfirmationEmailTimeChanged =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    // content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p>Your appointment for Health Screening at the Medical Express Clinic is confirmed by the clinic. <span style="font-weight:600;color:red">We have had to adjust your appointment time, so please carefully review your appointment details and feel free to get in touch if this time isn't convenient, we will rearrange the screening to suit your schedule.</span> If your amended time is suitable, then we look forward to welcoming you at the clinic. </p>`;
    // content += `<p style="font-size:18px; font-weight:800">‘If you have received this email your appointment is confirmed. Please <u>DON'T CALL</u> the clinic to confirm your appointment.’</p>`;

    const targetForm = `https://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/screening/${options._id}`;
    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #f29141 5%, #f68529 100%);background-color:#f68529;border-radius:6px;border:1px solid #f68529;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please have this number handy when you attend the clinic for your appointment.</p>`;
   
    content += '<p> Also, please complete patient registration form online before attending the clinic by following this link :  </p>'
    content += `<p> <a href="${targetForm}" style="${butonStyle}" target="_blank"> Complete Registration Form </a></p>`;

   
    content += `<p>Below is your booking information : </p>`;
    content += '<ul>';
    content += `<li> Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime} </li>`;
    content += `<li> Full Name : ${options.fullname} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `<li> Package : ${options.service} </li>`;
    content += `<li> Notes : ${options.notes ? options.notes : '-'} </li>`;

    content += `</ul>`;

  
    content += '<p style="font-weight:600"> Please Read our FAQs </p>';

    faq.forEach(element => {

        content += `<p style="border-left: 4px solid #f68529; background: #eee; font-weight:600;padding-left:10px;line-height:50px"> <span style="color:#f68529;font-size:24px"> Q. </span> ${element.question} </p>`;
        content += `<p style="border-left: 4px solid #999; background: #fff; font-weight:400;color: #555;padding-left:10px;line-height:50px"> <span style="color:#555;font-size:24px"> A. </span>${element.answer} </p>`;

    });


    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Medical Express Clinic</p>`;
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
    

    const event = await createICS(options.bookingDate, options.bookingTimeNormalized, `${options.fullname}`, options.email);

    await sendMail(options.email, 'Health Screening Appointment Confirmation - Medical Express Clinic' , content, event);
   
}



const sendRegFormEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    // content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p> Please complete patient registration form online by following this link : </p>`;

    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #f29141 5%, #f68529 100%);background-color:#f68529;border-radius:6px;border:1px solid #f68529;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`
    const targetForm = `https://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/screening/${options._id}`;
    
    content += `<p> <a href="${targetForm}" style="${butonStyle}" target="_blank"> Complete Registration Form </a></p>`;
  

    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Medical Express Clinic</p>`;
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
    
    await sendMail(options.email, 'Registration Form for Health Screening - Medical Express Clinic' , content, null);
}


const sendRefundNotificationEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    // content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p> We have processed your appointment cancelation with Medical Express Clinic : (Ref# : <strong> ${options.bookingRef}</strong>) </p>`;
    content += `<p>  <strong> Your deposit has been refunded, please allow 4 working days to see it in your statement. </strong> </p>`;


    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Medical Express Clinic</p>`;
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
    
    await sendMail(options.email, 'Refund Deposit Notification - Medical Express Clinic' , content, null);
}




module.exports = {
    sendConfirmationEmail : sendConfirmationEmail,
    sendRegFormEmail: sendRegFormEmail,
    sendPatientNotificationEmail: sendPatientNotificationEmail,
    sendRefundNotificationEmail: sendRefundNotificationEmail
};