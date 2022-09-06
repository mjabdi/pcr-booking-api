
const express = require('express');
const router = express.Router();
const { Invoice } = require('./../../models/medex/Invoice')
const { BloodCode } = require('./../../models/medex/BloodCode')
const { MedexCode } = require('./../../models/medex/MedexCode')


const {BloodBooking} = require("./../../models/blood/BloodBooking")
const {GPBooking} = require("./../../models/gp/GPBooking")
const {GynaeBooking} = require("./../../models/gynae/GynaeBooking")
const {ScreeningBooking} = require("./../../models/screening/ScreeningBooking")
const {STDBooking} = require("./../../models/std/STDBooking")
const {Booking} = require("./../../models/Booking")




const uuid = require('uuid-random')
const mongoose = require('mongoose');
const { randomBytes } = require('crypto');
const { GlobalParams } = require('../../models/GlobalParams');
const dateformat = require("dateformat")

router.get('/getinvoicereports', async function (req, res, next) {
    try{

        const invoiceReports = await GlobalParams.findOne({ name: 'invoiceReports' });
        res.status(200).send({ status: 'OK', result: invoiceReports.value })

    }catch(err)
    {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }
})

router.post('/calculateinvoicereports', async function (req, res, next) {
    try{
        let result = []
        let invoicesArray = []

        let resultMap = new Map()

        const clinics = [
            {table: "bookings", clinic: "pcr"},
            {table: "gynaebookings", clinic: "gynae"},
            {table: "gpbookings", clinic: "gp"},
            {table: "stdbookings", clinic: "std"},
            {table: "bloodbookings", clinic: "blood"},
            {table: "screeningbookings", clinic: "screening"},
            {table: "corporatebookings", clinic: "corporate"},
            {table: "dermabookings", clinic: "derma"}
        ]

        for (var i = 0; i < clinics.length; i++) {
            const res = await Invoice.aggregate([
                {
                    "$lookup": {
                        "from": clinics[i].table,
                        "localField": "bookingId",
                        "foreignField": "_id",
                        "as": "booking"
                    }
                },
                { "$unwind": "$booking" },
                {
                    $addFields: { clinic: clinics[i].clinic },
                },
            
            ]);

            invoicesArray = [...invoicesArray, ...res]
        }

        for (var index = 0 ; index < invoicesArray.length ; index++)
        {
            const dateStr = dateformat(invoicesArray[index].timeStamp, 'mmmm-yyyy');
            const fee =  invoicesArray[index].grandTotal;
            const clinic = invoicesArray[index].clinic;

            resultMap[dateStr] = {
                total : (resultMap[dateStr] ? resultMap[dateStr].total || 0 : 0) + fee,
                pcr : (resultMap[dateStr] ? resultMap[dateStr].pcr || 0 : 0) + (clinic === "pcr" ? fee : 0),
                gynae : (resultMap[dateStr] ? resultMap[dateStr].gynae || 0 : 0) + (clinic === "gynae" ? fee : 0),
                gp : (resultMap[dateStr] ? resultMap[dateStr].gp || 0 : 0) + (clinic === "gp" ? fee : 0),
                std : (resultMap[dateStr] ? resultMap[dateStr].std || 0 : 0) + (clinic === "std" ? fee : 0),
                blood : (resultMap[dateStr] ? resultMap[dateStr].blood || 0 : 0) + (clinic === "blood" ? fee : 0),
                screening : (resultMap[dateStr] ? resultMap[dateStr].screening || 0 : 0) + (clinic === "screening" ? fee : 0),
                corporate : (resultMap[dateStr] ? resultMap[dateStr].corporate || 0 : 0) + (clinic === "corporate" ? fee : 0),
                derma : (resultMap[dateStr] ? resultMap[dateStr].derma || 0 : 0) + (clinic === "derma" ? fee : 0),
            }

            resultMap.set(dateStr, resultMap[dateStr])
        }

        for (let key of resultMap.keys()) {
            result.push({month: key, data: resultMap[key]})
          }

        result = JSON.stringify(result)

        let invoiceReports = await GlobalParams.findOne({ name: 'invoiceReports' });
        if (!invoiceReports) {
            invoiceReports = new GlobalParams(
                {
                    name: "invoiceReports",
                    lastExtRef : 1,
                    value: result
                })
        }else
        {
            invoiceReports.value = result
        }

        await invoiceReports.save()

        res.status(200).send({ status: 'OK', result: result})
    }catch(err)
    {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }
})


router.get('/getcorporates', async function (req, res, next) {
    try{
        let corporates = await GlobalParams.findOne({ name: 'corporates' });
        const result = corporates ? corporates.value : ''
        res.status(200).send({ status: 'OK', result: result})

    }catch(err)
    {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }
})

router.post('/updatecorporates', async function (req, res, next) {
    try{
        const {corporates} = req.body
        let prevCorporates = await GlobalParams.findOne({ name: 'corporates' });
        if (!prevCorporates) {
            prevCorporates = new GlobalParams(
                {
                    name: "corporates",
                    lastExtRef : 1,
                    value: corporates
                })
        }else
        {
            prevCorporates.value = corporates
        }

        await prevCorporates.save()
        res.status(200).send({ status: 'OK'})

    }catch(err)
    {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }
})

router.post('/searchallinvoicesbydate', async function (req, res, next) {

    try {

        const { search } = req.body;

        search.from = new Date(search.from)
        search.until = new Date(search.until)

        search.from.setHours(0, 0, 0, 0)
        search.until.setHours(23, 59, 59, 99)

        const clinics = [
            {table: "bookings", clinic: "pcr"},
            {table: "gynaebookings", clinic: "gynae"},
            {table: "gpbookings", clinic: "gp"},
            {table: "stdbookings", clinic: "std"},
            {table: "bloodbookings", clinic: "blood"},
            {table: "screeningbookings", clinic: "screening"},
            {table: "corporatebookings", clinic: "corporate"},
            {table: "dermabookings", clinic: "derma"}
        ]

        let invoicesArray = []

        let filteredClinics = search.clinic === 'all' ? [...clinics] : clinics.filter(e => e.clinic === search.clinic)
        const condition =  !search.corporate ? [
            { "timeStamp": { $gte: search.from } },
            { "timeStamp": { $lte: search.until } }
        ] : 
        [
            { "timeStamp": { $gte: search.from } },
            { "timeStamp": { $lte: search.until } },                            
            { "booking.corporate": search.corporate }  
        ]

        for (var i = 0; i < filteredClinics.length; i++) {
            const res = await Invoice.aggregate([
                {
                    "$lookup": {
                        "from": filteredClinics[i].table,
                        "localField": "bookingId",
                        "foreignField": "_id",
                        "as": "booking"
                    }
                },
                { "$unwind": "$booking" },
                {
                    "$match": {
                        "$and": condition
                    }
                },
                {
                    $addFields: { clinic: filteredClinics[i].clinic },
                },
            
            ]);

            invoicesArray = [...invoicesArray, ...res]
        }

        const invoices = [...invoicesArray].sort((a, b) => a.timeStamp - b.timeStamp)

        let result = invoices || []

        res.status(200).send({ status: 'OK', count: result.length, result: result })
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', count: 0, result: [], error: err })
    }

});


router.post('/searchallinvoicesbyname', async function (req, res, next) {

    try {

        const { search } = req.body;
        
        const regexp = new RegExp(search.name,"i")
        const regexp2 = new RegExp(search.name.replace(" ","  "),"i")

        const clinics = [
            {table: "bookings", clinic: "pcr"},
            {table: "gynaebookings", clinic: "gynae"},
            {table: "gpbookings", clinic: "gp"},
            {table: "stdbookings", clinic: "std"},
            {table: "bloodbookings", clinic: "blood"},
            {table: "screeningbookings", clinic: "screening"},
            {table: "corporatebookings", clinic: "corporate"},
            {table: "dermabookings", clinic: "derma"}
        ]

        let invoicesArray = []
        for (var i = 0; i < clinics.length; i++) {
            const res = await Invoice.aggregate([
                {
                    "$lookup": {
                        "from": clinics[i].table,
                        "localField": "bookingId",
                        "foreignField": "_id",
                        "as": "booking"
                    }
                },
                { "$unwind": "$booking" },
                {
                    "$match": {
                        "$or": [
                            {name: {$regex: regexp }},
                            {name: {$regex: regexp2 }},
                            {invoiceNumber: {$regex: regexp }},
                            {invoiceNumber: {$regex: regexp2 }},
                        ]
                    }
                },
                {
                    $addFields: { clinic: clinics[i].clinic },
                },
            
            ]);

            invoicesArray = [...invoicesArray, ...res]
        }

        const invoices = [...invoicesArray].sort((a, b) => a.timeStamp - b.timeStamp)

        let result = invoices || []

        res.status(200).send({ status: 'OK', count: result.length, result: result })
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', count: 0, result: [], error: err })
    }

});


const findBooking = async (id) => {
    let booking = null

    booking = await Booking.findOne({_id: id})
    if (booking)
    {
        return booking
    }

    booking = await BloodBooking.findOne({_id: id})
    if (booking)
    {
        return booking
    }

    booking = await GPBooking.findOne({_id: id})
    if (booking)
    {
        return booking
    }

    booking = await GynaeBooking.findOne({_id: id})
    if (booking)
    {
        return booking
    }

    booking = await ScreeningBooking.findOne({_id: id})
    if (booking)
    {
        return booking
    }

    booking = await STDBooking.findOne({_id: id})
    if (booking)
    {
        return booking
    }

    return null

}

router.post('/createinvoice', async function (req, res, next) {

    try {
        let { name, date, dateAttended, items, grandTotal, bookingId, address, postCode, notes } = req.body

        const payload = { name, date, dateAttended, items, grandTotal, bookingId, address, postCode, notes }

        if (!validateInvoice(payload)) {
            res.status(400).send({ status: 'FAILED', error: 'INVALID-DATA' })
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


        const booking = await findBooking(bookingId)
        if (booking)
        {
            if (booking.status === "booked")
            {
                booking.status = "patient_attended"
                await booking.save()
            }
        }
    
        res.status(200).send({ status: 'OK', invoice: invoice })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }
})

router.post('/updateinvoice', async function (req, res, next) {
    try {
        const { invoiceNumber } = req.query
        let { name, date, dateAttended, items, grandTotal, bookingId, address, postCode, notes } = req.body

        const payload = { name, date, dateAttended, items, grandTotal, bookingId, address, postCode, notes }

        if (!validateInvoice(payload)) {
            res.status(400).send({ status: 'FAILED', error: 'INVALID-DATA' })
            return
        }

        const invoice = await Invoice.findOne({ invoiceNumber: invoiceNumber })

        if (!invoice) {
            res.status(400).send({ status: 'FAILED', error: 'INVALID-INVOICE-NUMBER' })
            return
        }

        await Invoice.updateOne({ invoiceNumber: invoiceNumber }, payload)

        res.status(200).send({ status: 'OK' })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }
})

router.post('/deleteinvoice', async function (req, res, next) {
    try {
        let { invoiceNumber } = req.query
        const invoice = await Invoice.findOne({ invoiceNumber: invoiceNumber })

        if (!invoice) {
            res.status(400).send({ status: 'FAILED', error: 'INVALID-INVOICE-NUMBER' })
            return
        }

        await Invoice.deleteOne({ invoiceNumber: invoiceNumber })

        res.status(200).send({ status: 'OK' })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }
})



router.get('/getinvoicebybookingid', async function (req, res, next) {

    try {
        const bookingId = new mongoose.Types.ObjectId(req.query.bookingId)

        const invoice = await Invoice.findOne({ bookingId: bookingId })

        res.status(200).send({ status: 'OK', invoice: invoice })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }
})

router.get('/getinvoicebyinvoicenumber', async function (req, res, next) {

    try {
        const { invoiceNumber } = req.query

        const invoice = await Invoice.findOne({ invoiceNumber: invoiceNumber })

        res.status(200).send({ status: 'OK', invoice: invoice })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }
})


router.get('/getallcodes', async function (req, res, next) {
    try {

        const result = await MedexCode.aggregate([
            {
                $unionWith: {
                    coll: "bloodcodes",
                    pipeline: [
                        {
                            $addFields: { section: "blood", isBloodTable: true },
                        },
                    ],
                },
            },
            {
                $sort: { code: 1 },
            },
        ]).exec();

        res.status(200).send({ status: 'OK', result: result })


    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }

})

router.get('/getallbloodcodes', async function (req, res, next) {
    try {

        const result = await BloodCode.find({ hidden: { $ne: true } }).sort({ code: 1 }).exec()


        res.status(200).send({ status: 'OK', result: result })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }

})

router.get('/getallbloodcodesadmin', async function (req, res, next) {
    try {

        const result = await BloodCode.find().sort({ code: 1 }).exec()


        res.status(200).send({ status: 'OK', result: result })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }

})


router.post('/updatecode', async function (req, res, next) {
    try {
        const { id, newCode } = req.body

        if (newCode.isBloodTable)
        {
            await BloodCode.updateOne({_id: id}, {description : newCode.description, price: newCode.price, hidden: (newCode.hidden ? true : false)})

        }else
        {
            await MedexCode.updateOne({_id: id}, {description : newCode.description, price: newCode.price})
        }


        res.status(200).send({ status: 'OK'})
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }

})


router.post('/addcode', async function (req, res, next) {
    try {
        const { code , description, price } = req.body

        const count = await BloodCode.count()


        const bloodCode = new BloodCode(
            {
                code: code,
                description: description,
                price: price,
                newPrice: price,
                index: count + 6
            }
        )

        await bloodCode.save()


        res.status(200).send({ status: 'OK'})
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }

})




router.post('/getcodedetails', async function (req, res, next) {
    try {
        const { code } = req.body

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


        res.status(200).send({ status: 'OK', result: result })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: 'FAILED', error: err.message })
    }
})

function validateInvoice(payload) {
    return true
}

async function generateNewInvoiceNumber() {
    let lastInvoiceNumber = await GlobalParams.findOne({ name: 'lastInvoiceNumber' });
    if (!lastInvoiceNumber) {
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

function mapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }


module.exports = router