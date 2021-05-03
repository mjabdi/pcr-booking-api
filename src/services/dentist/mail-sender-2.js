const nodemailer = require('nodemailer');
const config = require('config');

const sendMail = async (to, subject, content, event) =>
{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.DentistMailAccount,
          pass: config.DentistMailPassword // naturally, replace both with your real credentials or an application-specific password
        }
      });
      
      const mailOptions = {
        from: `Dental Clinic ${config.DentistMailAccount}`,
        to: to,
        subject: subject,
        html : content,
        icalEvent: event
    
      };
      
      const result =  await transporter.sendMail(mailOptions);

      return result;

}

module.exports = {
    sendMail : sendMail
};

