'use strict'
const express = require('express');
const { apiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

router.use(apiKey)
router.use(checkPermission('0000'))

router.use('/api/product', require('./product'))
router.use('/api/', require('./access'))


module.exports = router