const mongodb = require('./../mongodb');
const TimeSlot = require('./../models/TimeSlot');
const dateformat = require('dateformat');
const {Booking} = require('../models/Booking');
const {Link} = require('./../models/link');
const config = require('config');
const path = require('path')
const sendMail = require('./../mail-sender')

const ExcelJS = require('exceljs');

const mailTo = "phe.lcrc@nhs.net";

(async () => {

    const today = new Date()
    const date = new Date(today.getTime() - 24 * 60 * 60 * 1000 ); 
    const startDate = new Date(date.getFullYear() , date.getMonth() , date.getDate() , 0,0,0,0);
    const endDate = new Date(date.getFullYear(), date.getMonth() , date.getDate() , 23,59,59,99);

    await mongodb();

    const filename = `TestToRelease-MedicalExpressClinic-${dateformat(date,'yyyy-mm-dd')}.xlsx`

    const bookings = await Link.aggregate([
      
        {"$lookup": {
            "from": "bookings",
            "localField": "filename",
            "foreignField": "filename",
            "as": "R"
          }},
          {"$unwind": "$R"},
          {"$match": {
            "$and": [
              {"R.tr": true},
              {"isPCR": true},
              {"timeStamp": {$gt : startDate}},
              {"timeStamp":  {$lt : endDate}}
          ]}},
    ]);

    // console.log(startDate)
    // console.log(endDate)
    // console.log(bookings)

    if (!bookings || bookings.length === 0)
    {
        process.exit(0)
        return
    }

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('PCR-Report');

    worksheet.properties.defaultRowHeight = 15;
    worksheet.properties.defaultColWidth = 13;

    const row1 = worksheet.getRow(1)
    row1.getCell(1).value = "COVID-19 DAILY PUBLIC HEALTH REPORTING"
    row1.getCell(1).font = { name: 'Calibri', family: 4, size: 14, underline: 'double', bold: true };
    row1.getCell(7).value = dateformat(date,'dd/mm/yyyy')
    row1.getCell(7).font = { name: 'Calibri', family: 4, size: 14, underline: 'double', bold: true };

    const row2 = worksheet.getRow(2)
    row2.getCell(1).value =  "REPORTING ORGANISATION - MEDICAL EXPRESS CLINIC, 117a HARLEY STREET, LONDON, W1G 6AT"
    row2.getCell(1).font = { name: 'Calibri', family: 4, size: 14, underline: 'double', bold: true };
    row2.getCell(11).value =  "REPORTING CLINICIAN - DR M BAKHTIAR"
    row2.getCell(11).font = { name: 'Calibri', family: 4, size: 14, underline: 'double', bold: true };
    row2.getCell(19).value =  "Source Lab"
    row2.getCell(19).font = { name: 'Calibri', family: 4, size: 10, bold: true };
    worksheet.getRow(3).getCell(19).value = "The London Clinic Pathology"
    worksheet.getRow(3).getCell(19).font = { name: 'Calibri', family: 4, size: 12, bold: false };
    worksheet.getRow(4).getCell(19).value = "Reporting Lab"
    worksheet.getRow(4).getCell(19).font = { name: 'Calibri', family: 4, size: 10, bold: true };
    worksheet.getRow(5).getCell(19).value = "Medical Express Clinic"
    worksheet.getRow(5).getCell(19).font = { name: 'Calibri', family: 4, size: 12, bold: false };
    worksheet.getRow(6).getCell(19).value = "Organism"
    worksheet.getRow(6).getCell(19).font = { name: 'Calibri', family: 4, size: 10, bold: true };
    worksheet.getRow(5).getCell(19).value = "Covid 19"
    worksheet.getRow(5).getCell(19).font = { name: 'Calibri', family: 4, size: 12, bold: false };
    worksheet.getRow(7).getCell(19).value = "Specimen Type"
    worksheet.getRow(7).getCell(19).font = { name: 'Calibri', family: 4, size: 10, bold: true };
    worksheet.getRow(8).getCell(19).value = "Nasopharyngeal Swab"
    worksheet.getRow(8).getCell(19).font = { name: 'Calibri', family: 4, size: 12, bold: false };
    worksheet.getRow(9).getCell(19).value = "Identification Method"
    worksheet.getRow(9).getCell(19).font = { name: 'Calibri', family: 4, size: 10, bold: true };
    worksheet.getRow(10).getCell(19).value = "Anatolia Geneworks Bosphore PCR Assay"
    worksheet.getRow(10).getCell(19).font = { name: 'Calibri', family: 4, size: 12, bold: false };

    worksheet.getColumn(17).width = 5
    worksheet.getColumn(18).width = 5


    const row3 = worksheet.getRow(4)
    row3.height = 25
    const columns = ["Date", "Forename", "Surename" , "D.O.B", "Email", "Tel", "Passport No.", "Ethnicity", "Isolating Address", "Post Code", 
                        "Arrival Date", "Flight Number", "Departed Date", "Travelling From", "Symptoms", "Test Result"  ]

    columns.forEach((col, index) =>
        {
            row3.getCell(index+1).value = col;
            row3.getCell(index+1).font = { name: 'Calibri', family: 4, size: 10, bold: true };
        })


    if (bookings && bookings.length > 0)
    {
        bookings.forEach((booking, index) => {
            worksheet.getRow(5 + index).height = 30

            worksheet.getRow(5 + index).getCell(1).value = dateformat(date,'dd/mm/yyyy')
            worksheet.getRow(5 + index).getCell(2).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(2).value = booking.R.forenameCapital
            worksheet.getRow(5 + index).getCell(2).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(3).value = booking.R.surnameCapital
            worksheet.getRow(5 + index).getCell(3).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(4).value = booking.R.birthDate.replace('-','/').replace('-', '/')
            worksheet.getRow(5 + index).getCell(4).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(5).value = booking.R.email
            worksheet.getRow(5 + index).getCell(5).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(6).value = booking.R.phone
            worksheet.getRow(5 + index).getCell(6).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(7).value = booking.R.passportNumber
            worksheet.getRow(5 + index).getCell(7).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(8).value = booking.R.ethnicity
            worksheet.getRow(5 + index).getCell(8).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(9).value =  booking.R.selfIsolate ? booking.R.addressSI : booking.R.address
            worksheet.getRow(5 + index).getCell(9).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(10).value =  booking.R.selfIsolate ? booking.R.postCodeSI : booking.R.postCode
            worksheet.getRow(5 + index).getCell(10).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(11).value = booking.R.arrivalDate
            worksheet.getRow(5 + index).getCell(11).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(12).value = booking.R.flightNumber
            worksheet.getRow(5 + index).getCell(12).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(13).value = booking.R.lastDepartedDate
            worksheet.getRow(5 + index).getCell(13).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(14).value = booking.R.travellingFrom
            worksheet.getRow(5 + index).getCell(14).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(15).value = booking.result.toLowerCase() === 'negative' ? 'None' : ''
            worksheet.getRow(5 + index).getCell(15).font = { name: 'Calibri', family: 4, size: 12, bold: false };

            worksheet.getRow(5 + index).getCell(16).value = booking.result.toLowerCase() === 'negative' ? 'NEGATIVE' :  booking.result.toLowerCase() === 'positive' ? 'POSITIVE' :  booking.result 
            worksheet.getRow(5 + index).getCell(16).font = { name: 'Calibri', family: 4, size: 12, bold: true , color:  booking.result.toLowerCase() === 'negative' ?  {'argb': 'FF069E29'} : {'argb': 'FFFF0000'}};

        })
    }

 

    await workbook.xlsx.writeFile(path.join(config.ExcelFolder, filename));

    const attachments = [
        {
            path: path.join(config.ExcelFolder, filename),
            filename: filename
        }
    ]

   await sendMail(mailTo,"Statutory COVID-19 Notification for Test to Release","Statutory COVID-19 Notification for Test to Release - Medical Express Clinic",attachments)

    
    
    
    process.exit(0)

   



    
                                    
  
  
})();

