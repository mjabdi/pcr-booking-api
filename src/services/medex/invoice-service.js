
const express = require('express');
const router = express.Router();
const {Invoice} = require('./../../models/medex/Invoice')
const {BloodCode} = require('./../../models/medex/BloodCode')
const {MedexCode} = require('./../../models/medex/MedexCode')


const uuid = require('uuid-random')
const mongoose = require('mongoose');
const { randomBytes } = require('crypto');
const { GlobalParams } = require('../../models/GlobalParams');
const { LastMonthInstance } = require('twilio/lib/rest/api/v2010/account/usage/record/lastMonth');

router.post('/createinvoice', async function(req, res, next) {
    
    try
    {
        let {name, date, dateAttended, items, grandTotal, bookingId, address, postCode, notes} = req.body

        const payload = {name, date, dateAttended, items, grandTotal, bookingId, address, postCode, notes}

        if (!validateInvoice(payload))
        {
            res.status(400).send({status:'FAILED', error: 'INVALID-DATA'}) 
            return   
        }

        const invoiceNumber = await generateNewInvoiceNumber()

        const invoice = new Invoice(
            {
                timeStamp: new Date(),
                invoiceNumber: invoiceNumber,
                ...payload
            }
        )

        await invoice.save()


        res.status(200).send({status: 'OK', invoice: invoice }) 
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})

router.post('/updateinvoice', async function(req, res, next) {
    try
    {
        const {invoiceNumber} = req.query
        let {name, date, dateAttended, items, grandTotal, bookingId, address, postCode, notes} = req.body

        const payload = {name, date, dateAttended, items, grandTotal, bookingId, address, postCode, notes}

        if (!validateInvoice(payload))
        {
            res.status(400).send({status:'FAILED', error: 'INVALID-DATA'}) 
            return   
        }

        const invoice = await Invoice.findOne({invoiceNumber: invoiceNumber})

        if (!invoice) {
            res.status(400).send({status:'FAILED', error: 'INVALID-INVOICE-NUMBER'}) 
            return   
        }

        await Invoice.updateOne({invoiceNumber: invoiceNumber}, payload)

        res.status(200).send({status: 'OK'}) 
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})

router.post('/deleteinvoice', async function(req, res, next) {
    try
    {
        let {invoiceNumber} = req.query
        const invoice = await Invoice.findOne({invoiceNumber: invoiceNumber})

        if (!invoice) {
            res.status(400).send({status:'FAILED', error: 'INVALID-INVOICE-NUMBER'}) 
            return   
        }

        await Invoice.deleteOne({invoiceNumber: invoiceNumber})

        res.status(200).send({status: 'OK'}) 
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})



router.get('/getinvoicebybookingid', async function(req, res, next) {

    try
    {
        const bookingId = new mongoose.Types.ObjectId(req.query.bookingId)

        const invoice = await Invoice.findOne({bookingId: bookingId})

        res.status(200).send({status:'OK', invoice: invoice})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})

router.get('/getinvoicebyinvoicenumber', async function(req, res, next) {

    try
    {
        const {invoiceNumber} = req.query

        const invoice = await Invoice.findOne({invoiceNumber: invoiceNumber})

        res.status(200).send({status:'OK', invoice: invoice})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})


router.get('/getallcodes', async function(req, res, next) {
    try
    {

        const result = await MedexCode.aggregate([
            {
              $unionWith: {
                coll: "bloodcodes",
                pipeline: [
                  {
                    $addFields: { section: "blood" },
                  },
                ],
              },
            },
            {
              $sort: { code: 1 },
            },
          ]).exec();
      

        res.status(200).send({status:'OK', result: result})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }

})

router.get('/getallbloodcodes', async function(req, res, next) {
    try
    {

        const result = await BloodCode.find({hidden: {$ne: true}}).sort({code:1}).exec()
      

        res.status(200).send({status:'OK', result: result})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }

})

router.get('/getallbloodcodesadmin', async function(req, res, next) {
    try
    {

        const result = await BloodCode.find().sort({code:1}).exec()
      

        res.status(200).send({status:'OK', result: result})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }

})



router.post('/getcodedetails', async function(req, res, next) {
    try
    {
        const {code} = req.body

        const result = await MedexCode.aggregate([
            {
              $match: {
                   code: code 
              }
            },
            {
              $unionWith: {
                coll: "bloodcodes",
                pipeline: [
                  {
                    $match: {
                        code: code 
                   }
                       },
      
                  {
                    $addFields: { section: "blood" },
                  },
                ],
              },
            },
            {
              $sort: { index: 1 },
            },
          ]).exec();
      

        res.status(200).send({status:'OK', result: result})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status:'FAILED', error: err.message})
    }
})

function validateInvoice(payload){
    return true
}

async function generateNewInvoiceNumber()
{
    let lastInvoiceNumber = await GlobalParams.findOne({name:'lastInvoiceNumber'});
    if (!lastInvoiceNumber)
    {
        lastInvoiceNumber = new GlobalParams(
            {
                name: "lastInvoiceNumber",
                lastExtRef: 1
            })
         await lastInvoiceNumber.save()
         return 1   
    }

    lastInvoiceNumber.lastExtRef += 1
    await lastInvoiceNumber.save()
    return `MX21${lastInvoiceNumber.lastExtRef}`
}



module.exports = router