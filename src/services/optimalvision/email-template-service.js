const express = require('express');
const router = express.Router();
const {EmailTemplate} = require('../../models/optimalvision/EmailTemplate');
const dateformat = require('dateformat');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.post('/registernewtemplate', async function(req, res, next) {

    try
    {
        validatetemplate(req.body.template);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    const {template} = req.body

    try{

        const found = await EmailTemplate.findOne({templateID: template.templateID})                                       

        if (found)
        {
            res.status(200).send({status:'FAILED' , error: 'Repeated template!', template: req.body});
            return;
        }

        const newtemplate = new EmailTemplate(
            {
                ...template,
                timeStamp: new Date()
            }
        );

        await newtemplate.save();
        
        res.status(200).send({status: 'OK', template: newtemplate});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.post('/updatetemplate', async function(req, res, next) {

    try
    {
        req.body.id = ObjectId(req.body.id);
        validatetemplate(req.body.template);

    }catch(err)
    {
        console.error(err.message);
        res.status(400).send({status:'FAILED' , error: err.message });
        return;
    }

    try{

        await EmailTemplate.updateOne({_id : req.body.id}, {...req.body.template});

        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});

router.post('/deletetemplate', async function(req, res, next) {

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
        await EmailTemplate.deleteOne({_id : req.query.id});
        res.status(200).send({status: 'OK'});

    }catch(err)
    {
        console.log(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }
});


router.get('/gettemplatebyid', async function(req, res, next) {

    try{
         req.query.id = ObjectId(req.query.id);
         const result = await EmailTemplate.findOne({_id : req.query.id});
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

router.get('/gettemplatebytemplateid', async function(req, res, next) {

    try{
         const {templateID} = req.query
         const result = await EmailTemplate.findOne({templateID : templateID});
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});


router.get('/getalltemplates', async function(req, res, next) {

    try{

        const result = await EmailTemplate.find().sort({timeStamp: -1}).exec();
         res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send({status:'FAILED' , error: err.message });
    }
});

function validatetemplate (template){
    if (!template)
    {
        throw new Error('template object not present');
    }

    if (!template.templateID)
    {
        throw new Error('templateID field not present');
    }

    if (!template.subject)
    {
        throw new Error('subject field not present');
    }


    if (!template.html)
    {
        throw new Error('html field not present');
    }

    if (!template.rawText)
    {
        throw new Error('rawText field not present');
    }

}




module.exports = router;