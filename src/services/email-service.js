
const {sendMail} = require('./../mail-sender-2');
const {createICS} = require('./../ics-creator');


const sendEmail =  async (options) =>
{
    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: left;color: #333 !important;">`
    content += `<p>Dear ${options.forename},</p>`;
    content += `<p>Thank you for your booking at the Meical Express Clinic.</p>`;
    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please keep this number when you attend at the clinic.</p>`;
    content += `<p>Below is your booking information : </p>`;
    content += '<ul>';
    content += `<li> Appointment Time : ${options.bookingDate} at ${options.bookingTime} </li>`;
    content += `<li> Forename : ${options.forename} </li>`;
    content += `<li> Lastname : ${options.lastname} </li>`;
    content += `<li> Date of Birth : ${options.birthDate} </li>`;
    content += `<li> Address : ${options.address} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `</ul>`;
    content += `<p>Kind Regards,</p>`;
    content += `<p>Medical Express Clinic</p>`;
    content += '</div>'

    content += `<div style="padding: '25px 0 10px 0'; margin-top:10px; font-size: 14px; font-weight: 600 ;line-height: 25px; font-family: sans-serif;text-align: center ;color: #000;">`;
    content += '***   If you believe you have received this email in error, please delete it and notify info@blood.london   ***'
    content+= `</div>`

    const event = await createICS(options.bookingDate, options.bookingTimeNormalized, `${options.forename} ${options.surname}`, options.email);

    await sendMail(options.email, 'Your PCR Test Booking Confirmation' , content, event);
   
}

module.exports = sendEmail;