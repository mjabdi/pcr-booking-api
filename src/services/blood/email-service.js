
const {sendMail} = require('./mail-sender-2');
const {sendMailBloodReport} = require('./mail-sender');

const {createICS} = require('./ics-creator');


const { FormatDateFromString } = require('../DateFormatter');
const {User} = require('../../models/User');

const uuid = require('uuid-random');
const { UserEmailMap } = require('../../models/UserEmailMap');
const CreatePortalLink = require('../PortalLinkCreator');
const { test } = require('uuid-random');

const path = require("path")
const config = require("config")


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
    // content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p>Thank you for booking your appointment for <strong>"Blood Test"</strong> at the Medical Express Clinic. We look forward to welcoming you.</p>`;
    // content += `<p style="font-size:18px; font-weight:800">‘If you have received this email your appointment is confirmed. Please <u>DON'T CALL</u> the clinic to confirm your appointment.’</p>`;

    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please have this number handy when you attend the clinic for your appointment. You will now also be able to register and access your patient portal by visiting the link on our website homepage. This will have details of all of your past and future appointments, and allow you to directly book appointments with the clinic without the need to re-enter all of your personal information. </p>`;
   
    const target = `https://londonmedicalclinic.co.uk/medicalexpressclinic/user/edit/blood/${options._id}`;
    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #f29141 5%, #f68529 100%);background-color:#f68529;border-radius:6px;border:1px solid #f68529;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    const targetForm = `https://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/blood/${options._id}`;
    content += '<p> Also, please complete patient registration form online before attending the clinic by following this link :  </p>'
    content += `<p> <a href="${targetForm}" style="${butonStyle}" target="_blank"> Complete Registration Form </a></p>`;

   
    content += `<p>Below is your booking information : </p>`;
    content += '<ul>';
    content += `<li> Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime} </li>`;
    content += `<li> Full Name : ${options.fullname} </li>`;
    content += `<li> Telephone : ${options.phone ? options.phone : '-'} </li>`;
    content += `<li> Date of Birth : ${options.birthDate ? FormatDateFromString(options.birthDate) : '-'} </li>`;
    content += `<li> Notes : ${options.notes ? options.notes : '-'} </li>`;
    content += `<li> Package : ${options.packageName ? options.packageName : '-'} </li>`;
    if (options.indivisualTests)
    {
        const tests = JSON.parse(options.indivisualTests)
        let testsString = ''
        tests.forEach(item => {
            testsString += item.description
            testsString += ' , '
        } )
        content += `<li> Indivisual Tests : ${testsString} </li>`;
    }   
    
    if (options.doctorConsultation)
    {
        content += `<li> + Full Doctor Consultation </li>`;

    }
    
    content += `<li> Estimated Price : ${options.estimatedPrice} </li>`;
    content += `<li style="color:#f00000;font-weight:600"> If you are attending for a blood test on a self request basis (not referred by our doctor, as part of a package or a health screen) a blood draw fee of £50 is payable in addition to the fee for your test. </li>`



    content += `</ul>`;




    content += `<p>Follow this link if you need to modify your booking details, rearrange your appointment or cancel your booking : </p>`;



    content += `<p> <a href="${target}" style="${butonStyle}" target="_blank"> Cancel or Modify Appointment </a></p>`;
    content += await CreatePortalLink(options.email, options.fullname)

    
    // const targetForm = `https://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/gp/${options._id}`;
    // content += '<p> Also, please complete patient registration form online before attending the clinic by following this link :  </p>'
    // content += `<p> <a href="${targetForm}" style="${butonStyle}" target="_blank"> Complete Registration Form </a></p>`;
  
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

    await sendMail(options.email, 'Blood Test Appointment Confirmation - Medical Express Clinic' , content, event);
   
}


const sendRegFormEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    // content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p> Please complete patient registration form online by following this link : </p>`;

    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #f29141 5%, #f68529 100%);background-color:#f68529;border-radius:6px;border:1px solid #f68529;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`
    const targetForm = `https://londonmedicalclinic.co.uk/medicalexpressclinic/user/form/blood/${options._id}`;
    
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
    
    await sendMail(options.email, 'Registration Form for Blood Test - Medical Express Clinic' , content, null);
}

const sendBloodResultEmail =  async (options, email, notes) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear ${options.name},</p>`;
    content += `<p> Please find attached result of your blood test with Medical Express Clinic.</p>`;
    content += `<p>You can also download your results report by clicking the link below : </p>`;
    var reportLink = '#';
    if (options._id)
    {
        reportLink = `https://londonmedicalclinic.co.uk/medicalexpressclinic/download/pdf/downloadpdflabreport?id=${options._id}`;
    }

    if (options._id)
    {
        content += `<p> <a href="${reportLink}" target="_blank"> Download Blood Report </a> </p>`;
    }


    if (notes)
    {
        content += `<p style="font-weight:700;margin-top:20px; color:#333"> Doctor Notes: </p>`;
        content += `<div style="margin-top:-10px; padding:10px;border:1px solid #ddd;text-align: left">`;
        content += `<p style="font-weight:700;font-size:16px"> ${notes} </p>`;
        content += `</div>`
    }


    content += `<div style="margin-top:20px;margin-bottom:20px;padding:10px;border:2px solid #ddd;border-radius: 8px;max-width: 370px;text-align: center;font-size:18px;">`;
    content += `<p>Need help with your result?</p>`
    content += `<p> <a href="https://londonmedicalclinic.co.uk/medicalexpressclinic/book/gp/" target="_blank" style="color:blue"> Book our private doctor here </a></p>`
    content += `</div>`

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

    const attachmets = [
        {
            path: path.join(config.PdfFolder, "attachments" ,options.filename),
            filename: options.filename
        }
    ]
    
    await sendMailBloodReport(email, null, 'Blood Test Report - Medical Express Clinic' , content, attachmets);
}





module.exports = {
    sendConfirmationEmail : sendConfirmationEmail,
    sendRegFormEmail: sendRegFormEmail,
    sendBloodResultEmail: sendBloodResultEmail
};