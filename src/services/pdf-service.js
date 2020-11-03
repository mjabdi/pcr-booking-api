const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {createPDFForCovid1Form, createPDFForCovid2Form} = require('./../pdf-creator'); 

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
        
        const pdfBuffer = await createPDFForCovid2Form(id);
        
        res.set( {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=pcr-clinic-form-${id}.pdf`,
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