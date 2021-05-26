
const {sendMail} = require('./mail-sender-2');


const sendPaymentLinkEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%; max-width:500px ; font-size: 16px; line-height: 30px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear <span style="font-weight:600;margin-bottom:20px"> <i>${options.fullname.toUpperCase()}</i></span> ,</p>`;
    content += `<p>We would like to kindly ask you to follow the link below to complete the payment for the <b>Medical Express Clinic</b> : </p>`;
   
    const target = `https://londonmedicalclinic.co.uk/medicalexpressclinic/pay/${options._id}`;
    const butonStyle = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #f29141 5%, #f68529 100%);background-color:#f68529;border-radius:6px;border:1px solid #f68529;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:8px 70px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    content += `<p> <a href="${target}" style="${butonStyle}" target="_blank"> Pay Online Now </a></p>`;

    // content += `<p> * Your appointment is being held for you for four hours, please ensure that the deposit payment is made to secure the slot.</p>`


    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Medical Express Clinic</p>`;
    content += `</div>`;
  
  
    content += '</div>'

    content += `<div style="width:80%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. The clinic is located on the corner of Harley and Devonshire Streets, we have a blue door please ensure you attend the correct address for your appointment. </p>'
    content += '</div>'



    content += `<div style="width:80%; padding: '25px 0 10px 0'; margin-top:10px; font-size: 14px; font-weight: 600 ;line-height: 25px; font-family: sans-serif;text-align: center ;color: #000;">`;
    content += '***   If you believe you have received this email in error, please delete it and notify info@medicalexpressclinic.co.uk  ***'
    content+= `</div>`
  
    content += '</div>'

    await sendMail(options.email, 'Payment Link - Medical Express Clinic' , content, null);   
}


const sendRefundNotificationEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%; max-width:500px ; font-size: 16px; line-height: 30px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear <span style="font-weight:600;margin-bottom:20px"> <i>${options.fullname.toUpperCase()}</i></span> ,</p>`;
    content += `<p>We would like to inform you that your payment (£${options.amount}) with the <b>Medical Express Clinic</b> has been refunded. </p>`;
    content += `<p>  <strong> Please allow 4 working days to see it in your statement. </strong> </p>`;

    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Medical Express Clinic</p>`;
    content += `</div>`;
  
  
    content += '</div>'

    content += `<div style="width:80%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. The clinic is located on the corner of Harley and Devonshire Streets, we have a blue door please ensure you attend the correct address for your appointment. </p>'
    content += '</div>'



    content += `<div style="width:80%; padding: '25px 0 10px 0'; margin-top:10px; font-size: 14px; font-weight: 600 ;line-height: 25px; font-family: sans-serif;text-align: center ;color: #000;">`;
    content += '***   If you believe you have received this email in error, please delete it and notify info@medicalexpressclinic.co.uk  ***'
    content+= `</div>`

  
    content += '</div>'

    await sendMail(options.email, 'Refund Payment Notification - Medical Express Clinic' , content, null);
}

const sendThankEmail =  async (options) =>
{

    var content = '';
    content += `<div style="padding: '25px 0 10px 0'; width: 90%; max-width:500px ; font-size: 16px; line-height: 30px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<p>Dear <span style="font-weight:600;margin-bottom:20px"> <i>${options.fullname.toUpperCase()}</i></span> ,</p>`;
    content += `<p>Thank you for your payment (£${options.amount}) with the <b>Medical Express Clinic</b>.</p>`;
    content += `<p>Please do not hesitate to contact us if we can be of any further assistance.</p>`;

    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:600">Kind Regards,</p>`;
    content += `<p style="font-weight:600">Medical Express Clinic</p>`;
    content += `</div>`;
  
  
    content += '</div>'

    content += `<div style="width:80%; padding: '25px 0 10px 0'; font-size: 14px; line-height: 25px; font-family: sans-serif;text-align: left;color: #555 !important;">`
    content += '<p>Our address is: 117A Harley Street, Marylebone, London W1G 6AT, UK. The clinic is located on the corner of Harley and Devonshire Streets, we have a blue door please ensure you attend the correct address for your appointment. </p>'
    content += '</div>'



    content += `<div style="width:80%; padding: '25px 0 10px 0'; margin-top:10px; font-size: 14px; font-weight: 600 ;line-height: 25px; font-family: sans-serif;text-align: center ;color: #000;">`;
    content += '***   If you believe you have received this email in error, please delete it and notify info@medicalexpressclinic.co.uk  ***'
    content+= `</div>`

  
    content += '</div>'

    await sendMail(options.email, 'Successful Payment Notification - Medical Express Clinic' , content, null);
}






module.exports = {
    sendPaymentLinkEmail : sendPaymentLinkEmail,
    sendRefundNotificationEmail: sendRefundNotificationEmail,
    sendThankEmail: sendThankEmail,
};