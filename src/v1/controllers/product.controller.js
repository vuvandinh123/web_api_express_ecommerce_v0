'use strict'

const { CREATED, OK } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
    createProduct = async (req, res, next) => {
        new CREATED({
            message: "create product success",
            data: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    /**
     * 
     * @param {limit,page} req.query
     */
    findAllDraftForShop = async (req, res, next) => {
        const { limit, page } = req.query;
        new OK({
            message: "find one shop to draft success",
            data: await ProductService.findAllDraftForShop({
                product_shop: req.user.userId,
                limit: limit || 25,
                page: Number(page) - 1 || 0,
            })
        }).send(res)
    }
    findAllPublishForShop = async (req, res, next) => {
        const { limit, page } = req.query;
        new OK({
            message: "find one shop to publish success",
            data: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId,
                limit: limit || 25,
                page: Number(page) - 1 || 0,
            })
        }).send(res)
    }
    publishProductByShop = async (req, res, next) => {
        new OK({
            message: "publish product success",
            data: await ProductService.publishProductByShop({
                productId: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    unPublishProductByShop = async (req, res, next) => {
        new OK({
            message: "unpublish product success",
            data: await ProductService.unPublishProductByShop({
                productId: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    deletedProductByShop = async (req, res, next) => {
        new OK({
            message: "deleted product success",
            data: await ProductService.deletedProductByShop({
                productId: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    restoreProductByShop = async (req, res, next) => {
        new OK({
            message: "restore product success",
            data: await ProductService.restoreProductByShop({
                productId: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    searchProductByShop = async (req, res) => {
        /**
         * @param {q}  String Search product
         * @param {id} String id shop to search
         */
        const { id, q } = req.params
        new OK({
            message: "Search product success",
            data: await ProductService.searchProductByUserInShop({
                keySearch: q,
                product_shop: id
            })
        }).send(res)
    }
    findByIdProduct = async (req, res, next) => {
        new OK({
            message: "find id product success",
            data: await ProductService.findByIdProduct(req.params.id)
        }).send(res)
    }
    findAllProductByShop = async (req, res, next) => {
        // @param {id} String id shop
        const { id } = req.params
        const { limit, page } = req.query
        new OK({
            message: "find all product by shop success",
            data: await ProductService.findAllProductByShop({ product_shop: id, limit: limit || 25, page: page || 1 })
        }).send(res)
    }

}
module.exports = new ProductController()