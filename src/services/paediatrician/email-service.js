
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


const sendConfirmationEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p>Thank you for booking your appointment for Paediatric GP at the Medical Express Clinic. We look forward to welcoming you.</p>`;

    const targetForm = `https://www.travelpcrtest.com/medicalexpressclinic/user/form/paediatrician/${options._id}`;
    const target = `https://www.travelpcrtest.com/medicalexpressclinic/user/edit/paediatrician/${options._id}`;
    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #f29141 5%, #f68529 100%);background-color:#f68529;border-radius:6px;border:1px solid #f68529;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please have this number handy when you attend the clinic for your appointment. You will now also be able to register and access your patient portal by visiting the link on our website homepage. This will have details of all of your past and future appointments, and allow you to directly book appointments with the clinic without the need to re-enter all of your personal information. </p>`;
   
    content += '<p> Also, please complete patient registration form online before attending the clinic by following this link :  </p>'
    content += `<p> <a href="${targetForm}" style="${butonStyle}" target="_blank"> Complete Registration Form </a></p>`;

   
    content += `<p>Below is your booking information : </p>`;
    content += '<ul>';
    content += `<li> Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime} </li>`;
    content += `<li> Full Name : ${options.fullname} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `<li> Notes : ${options.notes ? options.notes : '-'} </li>`;

    content += `</ul>`;

    content += `<p>Follow this link if you need to modify your booking details, rearrange your appointment or cancel your booking : </p>`;




    content += `<p> <a href="${target}" style="${butonStyle}" target="_blank"> Cancel or Modify Appointment </a></p>`;
    content += await CreatePortalLink(options.email, options.fullname)

    
  
    content += '<p style="font-weight:600"> Please Read our FAQs </p>';

    faq.forEach(element => {

        content += `<p style="border-left: 4px solid #f68529; background: #eee; font-weight:600;padding-left:10px;line-height:50px"> <span style="color:#f68529;font-size:24px"> Q. </span> ${element.question} </p>`;
        content += `<p style="border-left: 4px solid #999; background: #fff; font-weight:400;color: #555;padding-left:10px;line-height:50px"> <span style="color:#555;font-size:24px"> A. </span>${element.answer} </p>`;

    });


    content += `<p> For any issues relating to your experience at the clinic, including delayed results, please email manager@medicalexpressclinic.co.uk and our management team will take action on any issues raised. </p>`


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

    await sendMail(
      options.email,
      "Paediatric GP Appointment Confirmation - Medical Express Clinic",
      content,
      event
    );
   
}


const sendRegFormEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p> Please complete patient registration form online by following this link : </p>`;

    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #f29141 5%, #f68529 100%);background-color:#f68529;border-radius:6px;border:1px solid #f68529;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`
    const targetForm = `https://www.travelpcrtest.com/medicalexpressclinic/user/form/paediatrician/${options._id}`;
    
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
    
    await sendMail(
      options.email,
      "Registration Form for Paediatric GP Visit - Medical Express Clinic",
      content,
      null
    );
}


const sendRefundNotificationEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
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
    
    await sendMail(
      options.email,
      "Refund Deposit Notification (Paediatric GP) - Medical Express Clinic",
      content,
      null
    );
}





module.exports = {
    sendConfirmationEmail : sendConfirmationEmail,
    sendRegFormEmail: sendRegFormEmail,
    sendRefundNotificationEmail: sendRefundNotificationEmail
};