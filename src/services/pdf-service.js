const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {createPDFForCovid1Form, createPDFForCovid2Form} = require('./../pdf-creator'); 
const {getPdfResult, getPdfCert} = require('./../pdf-finder'); 


const {Booking} = require('./../models/Booking');
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


module.exports = router;