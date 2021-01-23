
const {sendMail} = require('./mail-sender-2');
const {createICS} = require('./ics-creator');


const { FormatDateFromString } = require('./../DateFormatter');

const faq = [
    {
        question: "I just booked my appointment online, should I call the clinic to confirm my appointment?",
        answer: "Please do not call to confirm appointments that have already been confirmed via email. Once you have your 9 digit code, this appointment is confirmed."
    },
];


const sendConfirmationEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<img style="margin:10px" src="https://www.gynae-clinic.co.uk/public/design/images/gynae-clinic.png" alt="Gynae Clinic - private clinic London">`;
    content += `<p>Dear ${options.fullname},</p>`;
    content += `<p>Thank you for booking your appointment at the Gynae Clinic. We look forward to welcoming you.</p>`;
    content += `<p style="font-size:18px; font-weight:800">‘If you have received this email your appointment is confirmed. Please <u>DON'T CALL</u> the clinic to confirm your appointment.’</p>`;

    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please have this number handy when you attend at the clinic.</p>`;
    content += `<p>Below is your booking information : </p>`;
    content += '<ul>';
    content += `<li> Appointment Time : ${FormatDateFromString(options.bookingDate)} at ${options.bookingTime} </li>`;
    content += `<li> Full Name : ${options.fullname} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `<li> Package : ${options.service} </li>`;
    content += `<li> Notes : ${options.notes ? options.notes : '-'} </li>`;


    content += `</ul>`;

    content += `<p> Please follow this link if you need to modify your booking details, rearrange your appointment or cancel your booking : </p>`;

    // const target = `https://travelpcrtest.com/user/edit/${options.bookingRef}`;
    const target="#"
    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #f280c4 5%, #ff9cd7 100%);background-color:#ff9cd7;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    content += `<p> <a href="${target}" style="${butonStyle}" target="_blank"> Modify or Cancel Appointment </a></p>`;

  
    content += '<p style="font-weight:600"> Please Read our FAQs </p>';

    faq.forEach(element => {

        content += `<p style="border-left: 4px solid #f280c4; background: #eee; font-weight:600;padding-left:10px;line-height:50px"> <span style="color:#f280c4;font-size:24px"> Q. </span> ${element.question} </p>`;
        content += `<p style="border-left: 4px solid #999; background: #fff; font-weight:400;color: #555;padding-left:10px;line-height:50px"> <span style="color:#555;font-size:24px"> A. </span>${element.answer} </p>`;

    });


    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Gynae Clinic</p>`;
    content += `</div>`;
  
  
    content += '</div>'

    content += `<div style="width:80%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    // content += `<p>PLEASE note there might be a slight delay in your appointment time (less than 10 minutes) to help maintain social distancing.</p>`;
    content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. The clinic is located on the corner of Harley and Devonshire Streets, we have a blue door please ensure you attend the correct address for your appointment.</p>'
    content += '</div>'



    content += `<div style="width:80%; padding: '25px 0 10px 0'; margin-top:10px; font-size: 14px; font-weight: 600 ;line-height: 25px; font-family: sans-serif;text-align: center ;color: #000;">`;
    content += '***   If you believe you have received this email in error, please delete it and notify info@gynae-clinic.co.uk  ***'
    content+= `</div>`

    const event = await createICS(options.bookingDate, options.bookingTimeNormalized, `${options.fullname}`, options.email);

    await sendMail(options.email, 'Gynae Clinic Appointment Confirmation' , content, event);
   
}



module.exports = {
    sendConfirmationEmail : sendConfirmationEmail,
};