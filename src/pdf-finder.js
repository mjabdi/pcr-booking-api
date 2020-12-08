const fs = require('fs');
const {Booking} = require('./models/Booking');
const config = require('config');
const path = require('path');
const getStream = require('get-stream');
const { Link } = require('./models/link');

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

const getPdfLabReport = async (id) =>
{
    const link = await Link.findOne({_id: id});
    if (link)
    {
        const filePath = path.join(pdfFolder, 'attachments' , link.filename);
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
    getPdfCert : getPdfCert,
    getPdfLabReport : getPdfLabReport
}