const express = require('express');
const router = express.Router();

const pdfService = require('../services/pdf-service');



router.use('/pdf', pdfService);




module.exports = router;
