'use strict';
const { BadRequestError } = require("../core/error.response");
const productModel = require("../models/product.model");
const { findAllDraftForShopRepo, findAllPublishForShopRepo, publishProductByShopRepo, unPublishProductByShopRepo, deletedProductByShopRepo, restoreProductByShopRepo, searchProductByUserInShopRepo, findByIdProductRepo, findAllProductByShopRepo } = require("../models/repositories/product.repo");
const { clothingModel, electronicsModel } = require("../models/typeProduct")
const { Types } = require('mongoose')
class ProductFactory {

    static productRegister = {}
    static productRegisterType(type, classRef) {
        ProductFactory.productRegister[type] = classRef
    }
    /*
    * type = 'clothing' || 'electronics' || ....
    * payload 
    */
    static async createProduct(type, payload) {
        const newClass = ProductFactory.productRegister[type]
        if (!newClass) throw new BadRequestError(`Invalid product type ${type}`)
        return await new newClass(payload).createProduct()
    }
    // find all publish for shop
    static findAllPublishForShop = async ({ product_shop, limit = 25, page = 0 }) => {
        const query = { product_shop: product_shop, isPublished: true }
        return await findAllPublishForShopRepo({ query, limit, page })
    }
    // find all draft for shop
    static findAllDraftForShop = async ({ product_shop, limit = 25, page = 0 }) => {
        const query = { product_shop: product_shop, isDraft: true }
        return await findAllDraftForShopRepo({ query, limit, page })
    }
    // set publish product by shop 
    static publishProductByShop = async ({ product_shop, productId }) => {
        const query = { _id: new Types.ObjectId(productId), product_shop: product_shop }
        return await publishProductByShopRepo({ query })
    }
    // unpublish product by shop
    static unPublishProductByShop = async ({ product_shop, productId }) => {
        const query = { _id: productId, product_shop: product_shop }
        return await unPublishProductByShopRepo({ query })
    }
    // deleted product by shop
    static deletedProductByShop = async ({ product_shop, productId }) => {
        const query = { _id: productId, product_shop: product_shop }
        return await deletedProductByShopRepo({ query })
    }
    // restore product by shop
    static restoreProductByShop = async ({ product_shop, productId }) => {
        const query = { _id: productId, product_shop: product_shop }
        return await restoreProductByShopRepo({ query })
    }
    // search all product with keywords by shop
    static searchProductByUserInShop = async ({ keySearch, product_shop }) => {
        return await searchProductByUserInShopRepo({ keySearch, product_shop })
    }
    // get product by id
    static findByIdProduct = async (id) => {
        return await findByIdProductRepo(id)
    }
    // get all product by shop
    static findAllProductByShop = async ({ product_shop, limit, page }) => {

        return await findAllProductByShopRepo({ product_shop, limit, page })

    }
}
class Product {
    constructor({
        product_name, product_thumb, product_quantity,
        product_type, product_price, product_description, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_price = product_price
        this.product_description = product_description
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    async createProduct(productId) {
        return await productModel.create({ ...this, _id: productId })
    }
}
// define sub class Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError("Cannot create clothing")
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError("Cannot create product")

        return newProduct
    }
}

// define Electronics sub class 
class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronicsModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newElectronics) throw new BadRequestError("Cannot create Electronics")
        const newProduct = await super.createProduct(newElectronics._id)
        if (!newProduct) throw new BadRequestError("Cannot create product")
        return newProduct
    }
}
ProductFactory.productRegisterType('Clothing', Clothing)
ProductFactory.productRegisterType('Electronics', Electronics)

module.exports = ProductFactory