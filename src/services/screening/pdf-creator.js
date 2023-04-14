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

    doc.image('assets/medex_report_banner.png', 0, 0,  {fit: [800, 533], align: 'center', valign: 'top'});

    doc.image('assets/pdf-logo.png', 0, 450,  {fit: [615, 200], align: 'center', valign: 'bottom'});

    doc.fillColor('#968075').fontSize(14).font('Helvetica-Bold').text("Health Screening Report for:", 300, 100, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );

    doc.fillColor('#735f55').fontSize(20).font('Helvetica-Bold').text(booking.fullname, 300, 125, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );


    doc.addPage()



    // doc.fillColor('#105d8f').fontSize(12).font('Helvetica-Bold').text('THE LONDON CLINIC HEALTH SCREENING REPORT', 140, 100, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );

    doc.rect(20, 40, 550, 55);
    doc.fill("#035382");

    doc.fillColor('#f1f1f1').fontSize(10).font('Helvetica').text('Name:', 30, 55, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
    doc.fillColor('#fff').fontSize(10).font('Helvetica-Bold').text(booking.fullname, 70, 55, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );

    doc.fillColor('#f1f1f1').fontSize(10).font('Helvetica').text('DOB:', 30, 75, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
    doc.fillColor('#fff').fontSize(10).font('Helvetica-Bold').text(NormalizeDate(booking.birthDate), 70, 75, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );


    const introText = "Your tests have been compared to standard reference ranges to give you an indication of a normal health result. These were correct at the time of result generation but are subject to change in line with advanced medical practices and research."
    doc.fillColor('#013257').fontSize(14).font('Helvetica-Bold').text("Understanding your results", 40, 130, {characterSpacing : 1, wordSpacing : 1 , align : 'left'} );
    doc.fillColor('black').fontSize(12).font('Helvetica').text(introText, 40, 160 , {lineGap:7 ,characterSpacing : 1, wordSpacing : 1 , align : 'justify', width: 300, continued: false})


    doc.rect(40, 320, 500, 350).dash(5, {space: 5}).strokeColor("#999").stroke()
    doc.fillColor('#aaa').fontSize(20).font('Helvetica').text('Some text here...', 200, 480, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );

    doc.rect(360, 120, 180, 180).dash(5, {space: 5}).strokeColor("#999").stroke()
    doc.fillColor('#aaa').fontSize(16).font('Helvetica').text('image...', 420, 200, {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );



    doc.addPage()

    let start_y = 50
    const row_height = 300
    const page_height = 600
    let index = 0
    let counterPage = 0
    for (var i=0 ; i < reportData.length ; i++)
    {      
      if (reportData[i].value)
      {
        const {desc, low, high, inRange} = getDescriptionForItem(reportData[i].param, reportData[i].value, package)
        if (index % 2 === 0)
        {

          doc.rect(10, 20, 270, 730);
          doc.fill("#f5fafa");      

          doc.rect(10, 20, 270, 70);
          doc.fill("#d3dbdb");      

          const text_color = "#494f4f"

          if (reportData[i].value === "low")
          {
            doc.fillColor(text_color).fontSize(10).font('Helvetica-Bold').text(reportData[i].param, 20, start_y , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
            doc.fillColor('red').fontSize(10).font('Helvetica-Bold').text("LOW", 20, start_y + 20 , {characterSpacing : 1, wordSpacing : 1 , align : 'left'} );
  
            doc.fillColor('black').fontSize(10).font('Helvetica').text(desc, 20, start_y + 70 , {lineGap:7 ,characterSpacing : 1, wordSpacing : 1.2 , align : 'justify', width: 250, continued: true})
              .fillColor('red').fontSize(10).font('Helvetica-Bold').text(low,  {lineGap:7, characterSpacing : 1, wordSpacing : 1 , align : 'justify', width: 250, continued: false})


              doc.image('assets/warning.png', 20, 25,  {fit: [20, 20], align: 'left', valign: 'top'});  
          }
          else if (reportData[i].value === "high")
          {
            doc.fillColor(text_color).fontSize(10).font('Helvetica-Bold').text(reportData[i].param, 20, start_y , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
            doc.fillColor('red').fontSize(10).font('Helvetica-Bold').text("HIGH", 20, start_y + 20 , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );        
  
            doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(desc, 20, start_y + 70 , {lineGap:7 ,characterSpacing : 1, wordSpacing : 1.2 , align : 'justify', width: 250, continued: true})
              .fillColor('red').fontSize(10).font('Helvetica-Bold').text(high,  {lineGap:7, characterSpacing : 1, wordSpacing : 1 , align : 'justify', width: 250, continued: false})
  
              doc.image('assets/warning.png', 20, 25,  {fit: [20, 20], align: 'left', valign: 'top'});  

  
          }else if (reportData[i].value === "inRange")
          {
            doc.fillColor(text_color).fontSize(10).font('Helvetica-Bold').text(reportData[i].param, 20, start_y , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
            doc.fillColor('green').fontSize(10).font('Helvetica-Bold').text("NORMAL", 20, start_y + 20 , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
  
            doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(desc, 20, start_y + 70 , {lineGap:7 ,characterSpacing : 1, wordSpacing : 1.2 , align : 'justify', width: 250, continued: true})
            .fillColor('black').fontSize(10).font('Helvetica-Bold').text(inRange,  {lineGap:7, characterSpacing : 1, wordSpacing : 1 , align : 'justify', width: 250, continued: false})

              doc.image('assets/tick.png', 20, 25,  {fit: [20, 20], align: 'left', valign: 'top'});

  
          }
  

        }else{
          const start_x = 300

          doc.rect(290, 20, 270, 730);
          doc.fill("#fcf7fc");      

          doc.rect(290, 20, 270, 70);
          doc.fill("#e0d3e0");      
         
          const text_color = "#4d464d"
          if (reportData[i].value === "low")
          {
      
            doc.fillColor(text_color).fontSize(10).font('Helvetica-Bold').text(reportData[i].param, start_x, start_y , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
            doc.fillColor('red').fontSize(10).font('Helvetica-Bold').text("LOW", start_x, start_y + 20 , {characterSpacing : 1, wordSpacing : 1 , align : 'left'} );
  
            doc.fillColor('black').fontSize(10).font('Helvetica').text(desc, start_x, start_y + 70 , {lineGap:7 ,characterSpacing : 1, wordSpacing : 1.2 , align : 'justify', width: 250, continued: true})
              .fillColor('red').fontSize(10).font('Helvetica-Bold').text(low,  {lineGap:7, characterSpacing : 1, wordSpacing : 1 , align : 'justify', width: 250, continued: false})
  
              doc.image('assets/warning.png', 300, 25,  {fit: [20, 20], align: 'left', valign: 'top'});  

            }
          else if (reportData[i].value === "high")
          {
            doc.fillColor(text_color).fontSize(10).font('Helvetica-Bold').text(reportData[i].param, start_x, start_y , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
            doc.fillColor('red').fontSize(10).font('Helvetica-Bold').text("HIGH", start_x, start_y + 20 , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );        
  
            doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(desc, start_x, start_y + 70 , {lineGap:7 ,characterSpacing : 1, wordSpacing : 1.2 , align : 'justify', width: 250, continued: true})
              .fillColor('red').fontSize(10).font('Helvetica-Bold').text(high,  {lineGap:7, characterSpacing : 1, wordSpacing : 1 , align : 'justify', width: 250, continued: false})
  
              doc.image('assets/warning.png', 300, 25,  {fit: [20, 20], align: 'left', valign: 'top'});  
  
  
          }else if (reportData[i].value === "inRange")
          {
            doc.fillColor(text_color).fontSize(10).font('Helvetica-Bold').text(reportData[i].param, start_x, start_y , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
            doc.fillColor('green').fontSize(10).font('Helvetica-Bold').text("NORMAL", start_x, start_y + 20 , {characterSpacing : 1, wordSpacing : 1.2 , align : 'left'} );
  
            doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(desc, start_x, start_y + 70 , {lineGap:7 ,characterSpacing : 1, wordSpacing : 1.2 , align : 'justify', width: 250, continued: true})
            .fillColor('black').fontSize(10).font('Helvetica-Bold').text(inRange,  {lineGap:7, characterSpacing : 1, wordSpacing : 1 , align : 'justify', width: 250, continued: false})

            doc.image('assets/tick.png', 300, 25,  {fit: [20, 20], align: 'left', valign: 'top'});  

  
          }



        }

        index++;

        counterPage++
        if (counterPage >= 2)
        {
          counterPage = 0
          doc.addPage()
        }


        // if (i > 0)
        // {
        //   doc.moveTo(20, start_y - 10).lineTo(600, start_y  - 10).dash(5, {space: 5}).stroke() 
        // }

        // start_y += row_height
        // if (start_y > page_height)
        // {
        //   start_y = 50
        //   doc.addPage()
        // }
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
