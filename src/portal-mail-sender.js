const config = require('config');

const sendMail = async (receiver, subject, content, attachments) =>
{

    const send = require('gmail-send')({
        user: config.PortalMailAccount,
        pass: config.PortalMailPassword,
        to:   receiver,
        subject: subject,
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

module.exports = sendMail;