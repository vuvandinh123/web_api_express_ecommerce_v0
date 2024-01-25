'use strict'
const express = require('express');
const ProductController = require('../../controllers/product.controller');
const asyncHandler = require('../../middlewares/asyncHandle');
const { authencation } = require('../../auth/checkAuth');
const router = express.Router();

router.get('/search/:id/:q', asyncHandler(ProductController.searchProductByShop))
router.get('/shop/:id', asyncHandler(ProductController.findAllProductByShop))
router.get('/:id', asyncHandler(ProductController.findByIdProduct))

router.use(authencation)

// router post request
router.post('', asyncHandler(ProductController.createProduct))

// router put request
router.put('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.put('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))

router.put('/delete/:id', asyncHandler(ProductController.deletedProductByShop))
router.put('/restore/:id', asyncHandler(ProductController.restoreProductByShop))

// router query 
router.get('/draft', asyncHandler(ProductController.findAllDraftForShop))
router.get('/publish', asyncHandler(ProductController.findAllPublishForShop))

module.exports = router