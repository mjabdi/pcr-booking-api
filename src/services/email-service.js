
const {sendMail} = require('./../mail-sender-2');
const {createICS} = require('./../ics-creator');

const config = require('config');


const sendConfirmationEmail =  async (options) =>
{
    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 80%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<img style="margin:10px" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="Medical Express Clinic - private clinic London">`;
    content += `<p>Dear ${options.forename},</p>`;
    content += `<p>Thank you for booking your appointment at the Medical Express Clinic for a COVID-19 PCR Fit to Fly Test. We look forward to welcoming you.</p>`;
    content += `<p>Your booking number is <strong>"${options.bookingRef}"</strong>, please have this number handy when you attend at the clinic.</p>`;
    content += `<p>Below is your booking information : </p>`;
    content += '<ul>';
    content += `<li> Appointment Time : ${options.bookingDate} at ${options.bookingTime} </li>`;
    content += `<li> Forename : ${options.forename} </li>`;
    content += `<li> Lastname : ${options.lastname} </li>`;
    content += `<li> Date of Birth : ${options.birthDate} </li>`;
    content += `<li> Address : ${options.address} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `</ul>`;

    content += `<p> Your results are sent password protected, please ensure to check your spam box if results have not been received within 40 hours of your test date. The password will be your date of birth in the format DDMMYYYY. Please note your results will return from this email address: results@medicalexpressclinic.co.uk. </p>`

    content += `<p>Kind Regards,</p>`;
    content += `<p>Medical Express Clinic</p>`;
    content += '</div>'

    content += `<div style="padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    content += `<p>PLEASE note there might be a slight delay in your appointment time (less than 10 minutes) to help maintain social distancing, Patients are welcome to access the service now on a walk-in basis, however, you may face some slight delays on a walk-in basis as we will prioritise patients who have confirmed appointments.</p>`;
    content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. Please do let us know if you might be late, The results will be delivered to you by email. Please make sure to add results@medicalexpressclinic.co.uk to your safe sender list to ensure deliverability of your results. </p>'
    content += '</div>'



    content += `<div style="padding: '25px 0 10px 0'; margin-top:10px; font-size: 14px; font-weight: 600 ;line-height: 25px; font-family: sans-serif;text-align: center ;color: #000;">`;
    content += '***   If you believe you have received this email in error, please delete it and notify info@medicalexpressclinic.co.uk  ***'
    content+= `</div>`

    const event = await createICS(options.bookingDate, options.bookingTimeNormalized, `${options.forename} ${options.surname}`, options.email);

    await sendMail(options.email, 'PCR Test for Travel Appointment Confirmation' , content, event);
   
}

const sendAntiBodyEmail =  async (options) =>
{
    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: left;color: #333 !important;">`
    content += `<p>Booking information : </p>`;
    content += '<ul>';
    content += `<li> Appointment Time : ${options.bookingDate} at ${options.bookingTime} </li>`;
    content += `<li> Forename : ${options.forename} </li>`;
    content += `<li> Lastname : ${options.lastname} </li>`;
    content += `<li> Date of Birth : ${options.birthDate} </li>`;
    content += `<li> Email Address : ${options.email} </li>`;
    content += `<li> Address : ${options.address} </li>`;
    content += `<li> Telephone : ${options.phone} </li>`;
    content += `</ul>`;
    content += `<p>Kind Regards,</p>`;
    content += `<p>Medical Express Clinic</p>`;
    content += '</div>'

    await sendMail(config.AntibodyEmail, `${options.forenameCapital} ${options.surnameCapital} ${options.birthDate} COVID-19 Antibody Test (IgM & IgG)` , content, null);
   
}



module.exports = {
    sendConfirmationEmail : sendConfirmationEmail,
    sendAntiBodyEmail : sendAntiBodyEmail
};