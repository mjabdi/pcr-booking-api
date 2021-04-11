const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
const config = require('config')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {createPDFForCovid1Form, createPDFForCovid2Form, createPDFForGynaeRegistration, createPDFForGPRegistration, createPDFForSTDRegistration, createPDFForBloodRegistration, createPDFForInvoice, createPDFForDermaRegistration} = require('./../pdf-creator'); 
const {getPdfResult, getPdfCert, getPdfLabReport} = require('./../pdf-finder'); 
const sendMail = require('./../invoice-mail-sender')

const {Booking} = require('./../models/Booking');
const {GynaeBooking} = require('./../models/gynae/GynaeBooking');
const {GPBooking} = require('./../models/gp/GPBooking');
const {STDBooking} = require('./../models/std/STDBooking');
const {BloodBooking} = require('./../models/blood/BloodBooking');
const {DermaBooking} = require('./../models/derma/DermaBooking');


const {GlobalParams} = require('./../models/GlobalParams');

router.get('/downloadcovidform1', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await createPDFForCovid1Form(id);
        
        
        //await Booking.updateOne({_id: id, status:'booked'}, {status: 'patient_attended'});

      

        res.set( {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=pcr-reg-form-${id}.pdf`,
            'Content-Transfer-Encoding': 'Binary'
          }).status(200).send(pdfBuffer);   
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.get('/downloadcovidform2', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        

        var extRef = '';
        const booking = await Booking.findOne({_id : id});

        if (!booking.extRef || booking.extRef === 'not-set')
        {
            const params = await GlobalParams.findOne({name:'parameters'});
            extRef = `MX${params.lastExtRef + 1}`;
            await GlobalParams.updateOne({name:'parameters'}, {lastExtRef : params.lastExtRef + 1});
            await Booking.updateOne({_id: id} , {extRef : extRef});
        }

        const pdfBuffer = await createPDFForCovid2Form(id);

        await Booking.updateOne({ $and: [{_id: id} , {$or: [{status:'patient_attended'}, {status:'booked'}]}]} , {status: 'sample_taken', samplingTimeStamp: new Date()});
        
        res.set( {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=pcr-clinic-form-${id}.pdf`,
                'Content-Transfer-Encoding': 'Binary'
              }).status(200).send(pdfBuffer);
        
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }

});

router.get('/downloadpdfresult', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await getPdfResult(id);
        
        res.set( {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=lab-result-${id}.pdf`,
                'Content-Transfer-Encoding': 'Binary'
              }).status(200).send(pdfBuffer);
        
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }

});



router.get('/downloadpdfcert', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await getPdfCert(id);
        
        res.set( {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=certificate-${id}.pdf`,
                'Content-Transfer-Encoding': 'Binary'
              }).status(200).send(pdfBuffer);
        
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }

});


router.get('/downloadpdflabreport', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await getPdfLabReport(id);
        
        res.set( {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=lab-report-${id}.pdf`,
                'Content-Transfer-Encoding': 'Binary'
              }).status(200).send(pdfBuffer);
        
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }

});


router.get('/downloadgynaeregform', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await createPDFForGynaeRegistration(id);        
        
        await GynaeBooking.updateOne({_id: id, status:'booked'}, {status: 'patient_attended'});

        res.set( {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=gynae-reg-form-${id}.pdf`,
            'Content-Transfer-Encoding': 'Binary'
          }).status(200).send(pdfBuffer);   
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.get('/downloadgpregform', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await createPDFForGPRegistration(id);        
        
        await GPBooking.updateOne({_id: id, status:'booked'}, {status: 'patient_attended'});

        res.set( {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=gp-reg-form-${id}.pdf`,
            'Content-Transfer-Encoding': 'Binary'
          }).status(200).send(pdfBuffer);   
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.get('/downloadstdregform', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await createPDFForSTDRegistration(id);        
        
        await STDBooking.updateOne({_id: id, status:'booked'}, {status: 'patient_attended'});

        res.set( {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=std-reg-form-${id}.pdf`,
            'Content-Transfer-Encoding': 'Binary'
          }).status(200).send(pdfBuffer);   
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});


router.get('/downloadbloodregform', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await createPDFForBloodRegistration(id);        
        
        await BloodBooking.updateOne({_id: id, status:'booked'}, {status: 'patient_attended'});

        res.set( {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=blood-reg-form-${id}.pdf`,
            'Content-Transfer-Encoding': 'Binary'
          }).status(200).send(pdfBuffer);   
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.get('/downloaddermaregform', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await createPDFForDermaRegistration(id);        
        
        await DermaBooking.updateOne({_id: id, status:'booked'}, {status: 'patient_attended'});

        res.set( {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=derma-reg-form-${id}.pdf`,
            'Content-Transfer-Encoding': 'Binary'
          }).status(200).send(pdfBuffer);   
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});




router.get('/downloadinvoice', async function(req, res, next) {

    var id = null;
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await createPDFForInvoice(id);      
        
        res.set( {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=invoice-${id}.pdf`,
            'Content-Transfer-Encoding': 'Binary'
          }).status(200).send(pdfBuffer);   
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});


router.post('/emailinvoice', async function(req, res, next) {

    var id = null;
    const email = req.query.email
    if (!email || email.length < 2)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;   
    }
    try{
        id = ObjectId(req.query.id);
        if (!id)
            throw new Error();

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: 'id parameter is not in correct format'});
        return;
    }

    try{
        
        const pdfBuffer = await createPDFForInvoice(id);      
        
        const filename = `invoice-${id}.pdf`
        const filePath =  path.join(config.InvoiceFolder, filename)
       
        const stream = fs.createWriteStream(filePath)
        stream.write(pdfBuffer)
        stream.end()

        const subject = "Invoice/Receipt - Medical Express Clinic"
        let content = ``
        const attachments = [
            {
                path: filePath,
                filename: filename
            }
        ]


        await sendMail(email,subject,content,attachments)
    
        res.status(200).send({status:'OK'});

    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});



module.exports = router;