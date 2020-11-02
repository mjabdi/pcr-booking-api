const PDFDocument = require('pdfkit');
const fs = require('fs');
const dateFormat = require('dateformat');

const {Booking} = require('./models/Booking');


function NormalizeDate(date)
{
    return `${date.substr(8,2)}/${date.substr(5,2)}/${date.substr(0,4)}` ;
}

function NormalizeAddress(address)
{
    return address.replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g," ");
}

const createPDFForCovid1Form = async (id, filePath) =>
{

    return new Promise( async (resolve, reject) => 
    {
        try
        {
            
            const booking = await Booking.findOne({_id : id});

            booking.birthDate = NormalizeDate(booking.birthDate);
            booking.bookingDate = NormalizeDate(booking.bookingDate);
            booking.address = NormalizeAddress(booking.address);
            
            const doc = new PDFDocument;
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            doc.image('assets/covid-form1.png', 0, 0,  {fit: [590, 720], align: 'center', valign: 'center'});
            
            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.surname.toUpperCase() , 100, 187  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );
            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.birthDate.toUpperCase() , 360, 187  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );
           
            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.forename.toUpperCase() , 100, 215  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );
            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.title , 305, 215  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );
          
            doc.fillColor('black').fontSize(9).font('Courier-Bold').text(booking.address , 100, 245  ,{width: 480, characterSpacing : 0.5, wordSpacing : 0.5 , lineGap : 1 } );

            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.postCode , 100, 272  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );
            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.email , 290, 272  ,{characterSpacing : 0.5, wordSpacing : 0.5 , lineGap : 2 } );

            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.phone , 100, 300  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );
            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.bookingDate , 360, 313  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );


            ///check boxes
            (booking.gender.toLowerCase() === 'male') ? doc.image('assets/checkbox-tick.jpg', 390, 213,  {scale : 0.55}) 
                                                        : doc.image('assets/checkbox.jpg', 390, 213,  {scale : 0.55});

            (booking.gender.toLowerCase() === 'female') ? doc.image('assets/checkbox-tick.jpg', 452, 213,  {scale : 0.55}) 
                                                        : doc.image('assets/checkbox.jpg', 452, 213,  {scale : 0.55});
         
            (booking.gender.toLowerCase() === 'other') ? doc.image('assets/checkbox-tick.jpg', 510, 213,  {scale : 0.55}) 
                                                         : doc.image('assets/checkbox.jpg', 510, 213,  {scale : 0.55});


            /// passport here
            if (booking.passportNumber && booking.passportNumber.length > 0)
            {
                doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text('PASSPORT NUMBER: ' , 20, 530  ,{characterSpacing : 0.5, wordSpacing : 1 , lineGap : 2 } );
                doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.passportNumber, 140, 529  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );
            }

            doc.end();
            stream.on( 'close' , () =>
            {
                resolve();
            });    
        }
        catch(err)
        {
            console.log(err);
            reject(err);
        }
    });
}

const createPDFForCovid2Form = async (id, filePath) =>
{

    return new Promise( async (resolve, reject) => 
    {
        try
        {
            
            const booking = await Booking.findOne({_id : id});

            const age = parseInt(new Date().getFullYear()) -  parseInt(booking.birthDate.substr(0,4));

            booking.birthDate = NormalizeDate(booking.birthDate);
            booking.bookingDate = NormalizeDate(booking.bookingDate);
            booking.address = NormalizeAddress(booking.address);
            
            const doc = new PDFDocument;
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            doc.image('assets/covid-form2.png', 0, 0,  {fit: [590, 720], align: 'center', valign: 'top'});
            
            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.surname.toUpperCase() , 100, 95  ,{characterSpacing : 4, wordSpacing : 8 , lineGap : 2 } );
            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.title , 370, 94  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );

            doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.forename.toUpperCase() , 100, 112  ,{characterSpacing : 4, wordSpacing : 8 , lineGap : 2 } );

            doc.fillColor('black').fontSize(10).font('Courier-Bold').text(booking.birthDate , 33, 150  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );           
            doc.fillColor('black').fontSize(10).font('Courier-Bold').text(`${age}` , 158, 150  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );

            doc.fillColor('black').fontSize(10).font('Courier-Bold').text(booking.bookingDate , 336, 150  ,{characterSpacing : 0.8, wordSpacing : 1 , lineGap : 2 } );

            ///check boxes
            (booking.gender.toLowerCase() === 'male') ? doc.image('assets/checkbox-tick.jpg', 230, 149,  {scale : 0.6}) 
                                                        : doc.image('assets/checkbox.jpg', 230, 149,  {scale : 0.6});

            (booking.gender.toLowerCase() === 'female') ? doc.image('assets/checkbox-tick.jpg', 293, 149,  {scale : 0.6}) 
                                                        : doc.image('assets/checkbox.jpg', 293, 149,  {scale : 0.6});

            // doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.forename.toUpperCase() , 100, 215  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );
            //   
            // doc.fillColor('black').fontSize(9).font('Courier-Bold').text(booking.address , 100, 245  ,{width: 480, characterSpacing : 0.5, wordSpacing : 0.5 , lineGap : 1 } );

            // doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.postCode , 100, 272  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );
            // doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.email , 290, 272  ,{characterSpacing : 0.5, wordSpacing : 0.5 , lineGap : 2 } );

            // doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.phone , 100, 300  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );
            // doc.fillColor('black').fontSize(12).font('Courier-Bold').text(booking.bookingDate , 360, 313  ,{characterSpacing : 2, wordSpacing : 2 , lineGap : 2 } );


            // ///check boxes
            // (booking.gender.toLowerCase() === 'male') ? doc.image('assets/checkbox-tick.jpg', 390, 213,  {scale : 0.55}) 
            //                                             : doc.image('assets/checkbox.jpg', 390, 213,  {scale : 0.55});

            // (booking.gender.toLowerCase() === 'female') ? doc.image('assets/checkbox-tick.jpg', 452, 213,  {scale : 0.55}) 
            //                                             : doc.image('assets/checkbox.jpg', 452, 213,  {scale : 0.55});
         
            // (booking.gender.toLowerCase() === 'other') ? doc.image('assets/checkbox-tick.jpg', 510, 213,  {scale : 0.55}) 
            //                                              : doc.image('assets/checkbox.jpg', 510, 213,  {scale : 0.55});

            doc.end();
            stream.on( 'close' , () =>
            {
                resolve();
            });    
        }
        catch(err)
        {
            console.log(err);
            reject(err);
        }
    });
}

module.exports = {
    createPDFForCovid1Form : createPDFForCovid1Form,
    createPDFForCovid2Form : createPDFForCovid2Form
}


