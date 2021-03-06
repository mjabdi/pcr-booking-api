const config = require('config');

const sendMail = async (receiver, bcc, subject, content, attachments) =>
{

    const send = require('gmail-send')({
        user: config.PortalMailAccount,
        pass: config.PortalMailPassword,
        to:   receiver,
        bcc:  bcc,
        subject: subject,
        pool : true
    });

    try{
        const {result,full} = await send(
            {
                html:   content,
                files : attachments  
            }
        );
        console.log(result);
        if (result.indexOf('OK') > -1)
            return true;
        else
            return false;    
    }
    catch(error) {
        console.error('ERROR', error);
        return false;
    }
   
}

module.exports = {
    sendMailBloodReport: sendMail
};