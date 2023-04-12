const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

const dateformat = require("dateformat");
const { getDescriptionForItem } = require("./report-utils");


function NormalizeDate(date) {
  return `${date.substr(8, 2)}/${date.substr(5, 2)}/${date.substr(0, 4)}`;
}

function NormalizeAddress(address) {
  return address.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ");
}

const createScreeningReportPDF = async (booking, reportData, package) => {
  try {

    const doc = new PDFDocument();

    doc.image('assets/pdf-logo.png', 0, 0,  {fit: [615, 800], align: 'center', valign: 'top'});

    doc.fillColor('#105d8f').fontSize(12).font('Helvetica-Bold').text('THE LONDON CLINIC HEALTH SCREENING REPORT', 140, 100, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );


    doc.moveTo(20, 120).lineTo(600, 120).dash(5, {space: 5}).strokeColor("#777").stroke() 

    doc.fillColor('black').fontSize(10).font('Times-Roman').text('Name:', 20, 130, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
    doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(booking.fullname, 70, 130, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );

    doc.fillColor('black').fontSize(10).font('Times-Roman').text('DOB:', 20, 145, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
    doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(NormalizeDate(booking.birthDate), 70, 145, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );

    doc.moveTo(20, 160).lineTo(600, 160).dash(5, {space: 5}).stroke() 

    let start_y = 180
    const row_height = 300
    const page_height = 600
    for (var i=0 ; i < reportData.length ; i++)
    {      
      if (reportData[i].value)
      {
        const {desc, low, high, inRange} = getDescriptionForItem(reportData[i].param, reportData[i].value, package)

        if (reportData[i].value === "low")
        {
          doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(reportData[i].param, 20, start_y , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
          doc.fillColor('red').fontSize(10).font('Helvetica-Bold').text("LOW", 20, start_y + 15 , {characterSpacing : 1, wordSpacing : 1 , align : 'left'} );

          doc.fillColor('black').fontSize(10).font('Helvetica').text(desc, 20, start_y + 35 , {lineGap:7 ,characterSpacing : 1, wordSpacing : 1.2 , align : 'justify', width: 550, continued: true})
            .fillColor('red').fontSize(10).font('Helvetica-Bold').text(low,  {lineGap:7, characterSpacing : 1, wordSpacing : 1 , align : 'justify', width: 550, continued: false})

        }else if (reportData[i].value === "high")
        {
          doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(reportData[i].param, 20, start_y , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
          doc.fillColor('red').fontSize(10).font('Helvetica-Bold').text("HIGH", 20, start_y + 15 , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );        

          doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(desc, 20, start_y + 35 , {lineGap:7 ,characterSpacing : 1, wordSpacing : 1.2 , align : 'justify', width: 550, continued: true})
            .fillColor('red').fontSize(10).font('Helvetica-Bold').text(high,  {lineGap:7, characterSpacing : 1, wordSpacing : 1 , align : 'justify', width: 550, continued: false})



        }else if (reportData[i].value === "inRange")
        {
          doc.fillColor('black').fontSize(10).font('Times-Roman').text(reportData[i].param, 20, start_y , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
          doc.fillColor('green').fontSize(10).font('Helvetica-Bold').text("NORMAL", 20, start_y + 15 , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );

          doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(desc, 20, start_y + 35 , {lineGap:7 ,characterSpacing : 1, wordSpacing : 1.2 , align : 'justify', width: 550, continued: true})
          .fillColor('black').fontSize(10).font('Helvetica-Bold').text(inRange,  {lineGap:7, characterSpacing : 1, wordSpacing : 1 , align : 'justify', width: 550, continued: false})

        }


        if (i > 0)
        {
          doc.moveTo(20, start_y - 10).lineTo(600, start_y  - 10).dash(5, {space: 5}).stroke() 
        }

        start_y += row_height
        if (start_y > page_height)
        {
          start_y = 50
          doc.addPage()
        }
      }
    }




    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  createScreeningReportPDF: createScreeningReportPDF
};
