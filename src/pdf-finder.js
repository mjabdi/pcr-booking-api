const fs = require('fs');
const {Booking} = require('./models/Booking');
const config = require('config');
const path = require('path');
const getStream = require('get-stream');

const pdfFolder = config.PdfFolder;

const getPdfResult = async (id) =>
{
    const booking = await Booking.findOne({_id: id});
    if (booking)
    {
        const filePath = path.join(pdfFolder, 'pdf-results', 'sent', booking.filename);
        const src = fs.createReadStream(filePath);
        return await getStream.buffer(src);
    }
}

const getPdfCert = async (id) =>
{
    const booking = await Booking.findOne({_id: id});
    if (booking)
    {
        const filePath = path.join(pdfFolder, 'pdf-results', 'certs', `certificate-${booking.filename}`);
        const src = fs.createReadStream(filePath);
        return await getStream.buffer(src);
    }    
}

module.exports = {
    getPdfResult : getPdfResult,
    getPdfCert : getPdfCert
}