const express = require('express');
const router = express.Router();
const {Patient} = require('../../models/optimalvision/Patient');
const dateformat = require('dateformat');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


router.post('/registernewpatient', async function(req, res, next) {

    try
    {
        validatePatient(req.body.patient);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    const {patient} = req.body

    try{

        const found = await Patient.findOne({patientID: patient.patientID, 
                                         deleted: {$ne: true}                                      
                                        });

        if (found)
        {

            res.status(200).send({status:'FAILED' , error: 'Repeated Patient!', person: req.body});
            return;
        }

        let formData = JSON.parse(patient.formData)
        formData.timeStamp = new Date()
        patient.formData = JSON.stringify(formData)

        const newPatient = new Patient(
            {
                ...patient,
                timeStamp: new Date()
            }
        );

        await newPatient.save();
        
        res.status(200).send({status: 'OK', patient: newPatient});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.post('/updatepatient', async function(req, res, next) {

    try
    {
        req.body.id = ObjectId(req.body.id);
        validatePatient(req.body.patient);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

       const oldPatient = await Patient.findOne({_id: req.body.id});
       const oldFormData = oldPatient.formData
       const oldHistory = oldPatient.history || []
       oldHistory.push(oldFormData)

       const formData = JSON.parse(req.body.patient.formData)
       formData.timeStamp = new Date()
       req.body.patient.formData = JSON.stringify(formData)

       

        await Patient.updateOne({_id : req.body.id}, {...req.body.patient, history: oldHistory});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.post('/deletepatient', async function(req, res, next) {

    try
    {
        req.query.id = ObjectId(req.query.id);

    }catch(err)
    {
        console.error(err);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

        await Patient.updateOne({_id : req.query.id}, {deleted : true});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.post('/undeletepatient', async function(req, res, next) {

    try
    {
        req.query.id = ObjectId(req.query.id);

    }catch(err)
    {
        console.error(err);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

        await Patient.updateOne({_id : req.query.id}, {deleted : false});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});





router.get('/getpatientbyid', async function(req, res, next) {

    try{
         req.query.id = ObjectId(req.query.id);
         const result = await Patient.findOne({_id : req.query.id});
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getpatientbypatientid', async function(req, res, next) {

    try{
         const {patientID} = req.query
         const result = await Patient.findOne({patientID : patientID, deleted: {$ne: true}});
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.get('/getallpatients', async function(req, res, next) {

    try{

        const result = await Patient.aggregate(
            [
                { $addFields: { fullname: { $concat: [ "$name", " ", "$surname" ] } } },
                { $match :  {deleted : {$ne : true }}}
            ]
            ).sort({timeStamp: -1}).exec();


        //  const result = await Patient.find( {deleted : {$ne : true }} ).sort({timeStamp: -1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/getdeletedpatients', async function(req, res, next) {

    try{
         const result = await Patient.find( {deleted : {$eq : true }} ).sort({timeStamp: -1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


function validatePatient (patient){
    if (!patient)
    {
        throw new Error('patient object not present');
    }

    if (!patient.name)
    {
        throw new Error('name field not present');
    }

    if (!patient.surname)
    {
        throw new Error('surname field not present');
    }

    if (!patient.patientID)
    {
        throw new Error('patientID field not present');
    }


}




module.exports = router;