const express = require('express');
const router = express.Router();

const callHookService = require('../services/callhook-service');



router.use('/call', callHookService);




module.exports = router;
