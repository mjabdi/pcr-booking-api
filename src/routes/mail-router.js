const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/sendmail', async function (req, res) {
   
    try{
        const {user, pass, to, subject, content} = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: user,
            pass: pass // naturally, replace both with your real credentials or an application-specific password
            }
        });
        
        const mailOptions = {
            from: user,
            to: to,
            subject: subject,
            html : content,
        };
        
        const result =  await transporter.sendMail(mailOptions);

        res.send({status: "OK", result : result});

    }
    catch(err)
    {
        res.status(500).send({status: "FAILED", error : err.message});
    }
  

});




module.exports = router;
