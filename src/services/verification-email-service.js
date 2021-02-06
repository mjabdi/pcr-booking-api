const sendMail = require('../portal-mail-sender')

const sendVerificationEmail = async (email, forename, verificationCode) =>
{
    let content = ''

    const verficationCodeStr = `${verificationCode}`

    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<img style="margin:10px" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="Medical Express Clinic - private clinic London">`;

    content += `<p> Dear ${forename}, </p>`
    content += '<p> Thank you for registration at Medical Express Clinic. </p>'
    content += `<p> Your verification code is : `
    content += `<div style="display:inline-block; margin:20px; padding:10px;border:1px solid #eee; letter-spacing: 0.5em; font-weight:800; font-size:1.5em"> ${verficationCodeStr} </div>`
    content += '</p>' 

    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:400">Kind Regards,</p>`;
    content += `<p style="font-weight:400">Medical Express Clinic</p>`;
    content += `</div>`;
  
    content += `<div style="width:80%; padding: '25px 0 10px 0'; margin-top:10px; font-size: 14px; font-weight: 600 ;line-height: 25px; font-family: sans-serif;text-align: center ;color: #000;">`;
    content += '***   If you believe you have received this email in error, please delete it and notify info@medicalexpressclinic.co.uk  ***'
    content+= `</div>`
    
    content += '</div>'

    await sendMail(email,'Verification Code for Signup - Medical Express Clinic', content, null)

}

const sendForgotPasswordEmail = async (email, forename, verificationCode) =>
{
    let content = ''

    const verficationCodeStr = `${verificationCode}`

    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<img style="margin:10px" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="Medical Express Clinic - private clinic London">`;

    content += `<p> Dear ${forename}, </p>`
    content += '<p> You requested for a password reset account at Medical Express Clinic. </p>'
    content += `<p> Your verification code is : `
    content += `<div style="display:inline-block; margin:20px; padding:10px;border:1px solid #eee; letter-spacing: 0.5em; font-weight:800; font-size:1.5em"> ${verficationCodeStr} </div>`
    content += '</p>' 

    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:400">Kind Regards,</p>`;
    content += `<p style="font-weight:400">Medical Express Clinic</p>`;
    content += `</div>`;
  
    content += `<div style="width:80%; padding: '25px 0 10px 0'; margin-top:10px; font-size: 14px; font-weight: 600 ;line-height: 25px; font-family: sans-serif;text-align: center ;color: #000;">`;
    content += '***   If you believe you have received this email in error, please delete it and notify info@medicalexpressclinic.co.uk  ***'
    content+= `</div>`

    content += '</div>'

    await sendMail(email,'Password Reset Verification Code - Medical Express Clinic', content, null)
}

const sendWelcomeEmail = async (email, forename) =>
{
    let content = ''

    content += `<div style="padding: '25px 0 10px 0'; width: 90%;  font-size: 16px; line-height: 25px; font-family: sans-serif;text-align: justify;color: #333 !important;">`
    content += `<img style="margin:10px" src="https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png" alt="Medical Express Clinic - private clinic London">`;

    content += `<p> Dear ${forename}, </p>`
    content += '<p> Thank you for registration at Medical Express Clinic. </p>'
    content += `<p> Your username is : `
    content += `<div style="display:inline-block; margin:10px; padding:10px;border:1px solid #eee; font-weight:800; font-size:1em"> ${email} </div>`
    content += '</p>' 

    content += `<p> You can sign in to the patients portal via the following link : `
    content += `<div style="display:inline-block; margin:10px; padding:10px;border:1px solid #eee; font-weight:800; font-size:1em"> <a href='https://londonmedicalclinic.co.uk/medicalexpressclinic/patient'> https://londonmedicalclinic.co.uk/medicalexpressclinic/patient </a> </div>`
    content += '</p>' 


    content += `<div style="padding-top:10px">`;
    content += `<p style="font-weight:400">Kind Regards,</p>`;
    content += `<p style="font-weight:400">Medical Express Clinic</p>`;
    content += `</div>`;
  
    content += `<div style="width:80%; padding: '25px 0 10px 0'; margin-top:10px; font-size: 14px; font-weight: 600 ;line-height: 25px; font-family: sans-serif;text-align: center ;color: #000;">`;
    content += '***   If you believe you have received this email in error, please delete it and notify info@medicalexpressclinic.co.uk  ***'
    content+= `</div>`
    
    content += '</div>'

    await sendMail(email,'Welcome To Our Patients Portal - Medical Express Clinic', content, null)

}


module.exports = {
    sendVerificationEmail: sendVerificationEmail,
    sendForgotPasswordEmail: sendForgotPasswordEmail,
    sendWelcomeEmail: sendWelcomeEmail
}