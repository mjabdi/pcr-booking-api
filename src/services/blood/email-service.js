
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
        question: "When will I get my results?",
        answer: "Please note, as samples are referred to an external laboratory, Medical Express Clinic cannot guarantee turnaround times.  Turnaround times are listed on the website as a guide only however in over 98% of cases, results are returned to patients within the listed timeframe."
    },
    {
        question: "I just booked my appointment online, should I call the clinic to confirm my appointment?",
        answer: "Please do not call to confirm appointments that have already been confirmed via email. Once you have your 9 digit code, this appointment is confirmed."
    },
    {
        question: "Can I bring somebody to my appointment?",
        answer: "Yes, you can as we want all of our patients to be comfortable when using our services. Please do bear in mind that during the Coronavirus pandemic, you should consider whether it's really necessary to be accompanied as we also have trained clinic staff who will be more than happy to chaperone your appointment."
    },
    {
        question: "I don't know what test to order, can you help?",
        answer: "Yes, please feel free to book an appointment at your selected date at time, when you attend you can discuss with clinic staff the options that are available and suitable."
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
    if (options.IndividualTests)
    {
        const tests = JSON.parse(options.IndividualTests)
        let testsString = ''
        tests.forEach(item => {
            testsString += item.description
            testsString += ' , '
        } )
        content += `<li> Individual Tests : ${testsString} </li>`;
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
    content += `<p>Please find the attached result of your diagnostic test conducted at Medical Express Clinic.</p>`;
    content += `<p>You can also download your results report by clicking the link below :</p>`;
    var reportLink = '#';
    if (options._id)
    {
        reportLink = `https://londonmedicalclinic.co.uk/medicalexpressclinic/reports/${options._id}`;
    }

    if (options._id)
    {
        content += `<p> <a href="${reportLink}" target="_blank"> Download Blood Report </a> </p>`;
    }


        content += `<p style="font-weight:500;margin-top:20px; margin-bottom:20px; color:#333"> * You need to enter your date of birth to download the report. </p>`;


    if (notes)
    {
        content += `<p style="font-weight:700;margin-top:20px; color:#333"> Doctor Notes: </p>`;
        content += `<div style="margin-top:-10px; padding:10px;border:1px solid #ddd;text-align: left">`;
        content += `<p style="font-weight:700;font-size:16px"> ${notes} </p>`;
        content += `</div>`
    }


    content += `<p style="text-decoration: underline; font-weight:600;">Interpreting your blood test results:</p>`
    content += `<p>If your test has been conducted as part of a health screening, sexual health screening package or at the request of a clinician at Medical Express Clinic, please feel free to ask any and all questions at your review appointment with the doctor. </p>`
    content += `<p>If you have attended on a self-request basis, you will have confirmed for us to simply send your medical report without comment or review from our doctor, however you may not be able to fully understand the contents of your blood test report.</p>`
    content += `<p>Please note, the following information in this email is not intended as medical advice, or to help in providing a diagnosis, simply to aid in understanding your blood test results: </p>`
    content += `<p>Blood tests alone are not a substitute for seeing a doctor, particularly if you are feeling unwell or currently experiencing symptoms. You should not make a diagnosis or start any treatment without being under the care of a suitable doctor or a trained healthcare professional. We <strong>strongly</strong> recommend that you seek the attention of a registered medical practitioner if you are experiencing health problems.</p>`
    content += `<p>There are many times when test results which are out of range are entirely insignificant but there are other times when they are not. They always need to be interpreted in the context of the rest of your health and this can only be determined with a full clinical history and examination.</p>`
    content += `<p>The name of the test conducted can be found on the left column of your blood test report, with the test result printed just to the right of the test name.</p>`
    content += `<p>The reference range/normal values can be found in the far right hand column and on some of our reports, abnormal results will appear in bold and red.</p>`

    content += `<p>Please see the following example reference report (ATTACHED)</p>`
    content += `<p>Your lab report may also include the following terms: </p>`
    content += `<ul>`
    content += `<li> <strong>Negative</strong> which means the disease or substance being tested was <strong>not found</strong></li>`
    content += `<li> <strong>Positive</strong> which means the disease or substance was <strong>found</strong></li>`
    content += `<li> <strong>Inconclusive or uncertain,</strong> which means there wasn't enough information in the results to diagnose or rule out a disease. If you get an inconclusive result, you will probably get more tests.</li>`

    content += `<p>If you require more detailed analysis of your blood test result, including possible treatment, further investigations please book an appointment to see our doctor here:</p>`

    content += `<div style="margin-top:20px;margin-bottom:20px;padding:10px;border:2px solid #ddd;border-radius: 8px;max-width: 370px;text-align: center;font-size:18px;">`;
    content += `<p> <a href="https://londonmedicalclinic.co.uk/medicalexpressclinic/book/gp/" target="_blank" style="color:blue"> Book our private doctor here </a></p>`
    content += `</div>`


    content += `<p> For any issues relating to your experience at the clinic, including delayed results, please email manager@medicalexpressclinic.co.uk and our management team will take action on any issues raised. </p>`

    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Medical Express Clinic</p>`;
    content += `</div>`;
  
    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600;color:#000">PLEASE NOTE, THIS IS AN UNATTENDED EMAIL ADDRESS. IF YOU HAVE ANY FURTHER REQUESTS, PLEASE DIRECT THESE TO INFO@MEDICALEXPRESSCLINIC.CO.UK WE WILL NOT REPLY TO ANY EMAILS RECEIVED AT THIS ADDRESS.</p>`;
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
    content += `<p style="font-weight:600;">DISCLAIMER - If you have attended on a self-request basis, please consult with your physician, or other qualified healthcare provider regarding any questions you may have in respect of your blood test report. If you have undergone a consultation with a doctor at Medical Express Clinic, please feel free to request a review appointment to discuss your results.  </p>`
    content += "<p>This email is confidential and is intended for the addressee only. If you are not the addressee, please delete the email and do not use it in any way. Medical Express (London) Ltd does not accept or assume responsibility for any use of or reliance on this email by anyone, other than the intended addressee to the extent agreed for the matter to which this email relates. Medical Express (London) Ltd is a Private limited Company registered in England under registered number 05078684, with its registered address at 117a Harley Street, London, W1G 6AT. It is authorised and registered with the Care Quality Commission for regulated medical activities. </p>"
      
    content += `<img style="margin-left:45%" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="logo">`
    content += "</div>"

    // const attachmets = [
    //     {
    //         path: path.join(config.PdfFolder, "attachments" ,options.filename),
    //         filename: options.filename
    //     },
    //     {
    //         path: path.join(config.PdfFolder, "attachments" , "blood_test_interp_guide.pdf"),
    //         filename: "Blood Test Interp Guide.pdf"
    //     }
    // ]

    const attachmets = [
        {
            path: path.join(config.PdfFolder, "attachments" , "blood_test_interp_guide.pdf"),
            filename: "Blood Test Interp Guide.pdf"
        }
    ]

    
    await sendMailBloodReport(email, null, 'Blood Test Report - Medical Express Clinic' , content, attachmets);
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
    sendBloodResultEmail: sendBloodResultEmail,
    sendRefundNotificationEmail: sendRefundNotificationEmail
};