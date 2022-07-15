
const {sendMail} = require('./mail-sender-2');

const { FormatDateFromString } = require('./../DateFormatter');


const sendPaymentLinkEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%; max-width:500px ; font-size: 16px; line-height: 30px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear <span style="font-weight:600;margin-bottom:20px"> <i>${options.fullname}</i></span> ,</p>`;
    content += `<p>We would like to kindly ask you to follow the link below to complete the payment for the <b>Museum Dental Suites</b> : </p>`;
   
    const target = `https://londonmedicalclinic.co.uk/museumdentalpayment/pay/${options._id}`;
    const butonStyle = `margin-top:5px; margin-bottom:10px ;box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #0d9ba8 5%, #05acb2 100%);background-color:#0c4e59;border-radius:6px;border:1px solid #fff5fc;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 70px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    content += `<p> <a href="${target}" style="${butonStyle}" target="_blank"> Pay Online Now </a></p>`;

    content += `<p> * Your appointment is being held for you for four hours, please ensure that the deposit payment is made to secure the slot.</p>`


    content += `<div style="padding-top:10px;line-height: 15px;">`;
    content += `<p style="font-weight:400">Kind Regards,</p>`;
    content += `<p style="font-weight:400">Museum Dental Suites</p>`;
    content += `<p style="font-weight:400;margin-top:20px;color:#777;font-size:12px">70 Great Russell St, Holborn, London WC1B 3BN, United Kingdom</p>`;
    content += `<p style="font-weight:400;color:#777;font-size:12px">0207 183 0886</p>`;
    content += `<p style="font-weight:800;color:#333;font-size:12px">PLEASE NOTE THIS EMAIL IS UNATTENDED, FOR ANY ENQUIRIES EMAIL info@museumdentalsuites.co.uk</p>`;

    
    
    content += `</div>`;
  
    content += '</div>'

    await sendMail(options.email, 'Payment Link - Museum Dental Suites' , content, null);   
}


const sendRefundNotificationEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%; max-width:500px ; font-size: 16px; line-height: 30px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear <span style="font-weight:600;margin-bottom:20px"> <i>${options.fullname}</i></span> ,</p>`;
    content += `<p>We would like to inform you that your payment (£${options.amount}) with the <b>Museum Dental Suites</b> has been refunded. </p>`;
    content += `<p>  <strong> Please allow 4 working days to see it in your statement. </strong> </p>`;

    content += `<div style="padding-top:10px;line-height: 15px;">`;
    content += `<p style="font-weight:400">Kind Regards,</p>`;
    content += `<p style="font-weight:400">Museum Dental Suites</p>`;
    content += `<p style="font-weight:400;margin-top:20px;color:#777;font-size:12px">70 Great Russell St, Holborn, London WC1B 3BN, United Kingdom</p>`;
    content += `<p style="font-weight:400;color:#777;font-size:12px">0207 183 0886</p>`;
    content += `<p style="font-weight:800;color:#333;font-size:12px">PLEASE NOTE THIS EMAIL IS UNATTENDED, FOR ANY ENQUIRIES EMAIL info@museumdentalsuites.co.uk</p>`;
    content += `</div>`;
  
    content += '</div>'

    await sendMail(options.email, 'Refund Payment Notification - Museum Dental Suites' , content, null);
}

const sendThankEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%; max-width:500px ; font-size: 16px; line-height: 30px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear <span style="font-weight:600;margin-bottom:20px"> <i>${options.fullname}</i></span> ,</p>`;
    content += `<p>Thank you for your payment (£${options.amount}) with the <b>Museum Dental Suites</b>.</p>`;
    content += `<p>Please do not hesitate to contact us if we can be of any further assistance.</p>`;

    content += `<div style="padding-top:10px;line-height: 15px;">`;
    content += `<p style="font-weight:400">Kind Regards,</p>`;
    content += `<p style="font-weight:400">Museum Dental Suites</p>`;
    content += `<p style="font-weight:400;margin-top:20px;color:#777;font-size:12px">70 Great Russell St, Holborn, London WC1B 3BN, United Kingdom</p>`;
    content += `<p style="font-weight:400;color:#777;font-size:12px">0207 183 0886</p>`;
    content += `<p style="font-weight:800;color:#333;font-size:12px">PLEASE NOTE THIS EMAIL IS UNATTENDED, FOR ANY ENQUIRIES EMAIL info@museumdentalsuites.co.uk</p>`;
    content += `</div>`;
  
    content += '</div>'

    await sendMail(options.email, 'Successful Payment Notification - Museum Dental Suites' , content, null);
}






module.exports = {
    sendPaymentLinkEmail : sendPaymentLinkEmail,
    sendRefundNotificationEmail: sendRefundNotificationEmail,
    sendThankEmail: sendThankEmail,
};