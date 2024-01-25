'use strict'
const express = require('express');
const AccessController = require('../../controllers/access.controller');
const asyncHandler = require('../../middlewares/asyncHandle');
const { authencation } = require('../../auth/checkAuth');
const router = express.Router();

router.post('/shop/singup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.signIn))

router.use(authencation)
router.post('/shop/logout', asyncHandler(AccessController.logOut))
router.post('/shop/refreshToken', asyncHandler(AccessController.refreshToken))

module.exports = router