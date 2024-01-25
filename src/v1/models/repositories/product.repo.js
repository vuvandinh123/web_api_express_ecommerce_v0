'use strict';
const { BadRequestError, NotFoundError } = require("../../core/error.response");
const shopService = require("../../services/shop.service");
const productModel = require("../product.model")
const { Types } = require('mongoose');
const findAllDraftForShopRepo = async ({ query, limit = 25, page = 1 }) => {
    return await queryProduct({ query, limit, page })
}
const findAllPublishForShopRepo = async ({ query, limit = 25, page = 1 }) => {
    return await queryProduct({ query, limit, page })
}
const publishProductByShopRepo = async ({ query }) => {
    const { modifiedCount } = await productModel.updateOne(query,
        { $set: { isPublished: true, isDraft: false } }, { multi: true }
    )
    return modifiedCount
}
const unPublishProductByShopRepo = async ({ query }) => {
    const { modifiedCount } = await productModel.updateOne(query, { $set: { isPublished: false, isDraft: true } }, { multi: true })
    return modifiedCount
}
const deletedProductByShopRepo = async ({ query }) => {
    const { modifiedCount } = await productModel.updateOne(query, { $set: { isPublished: false, isDraft: false, isDeleted: true } }, { multi: true })
    return modifiedCount
}
const restoreProductByShopRepo = async ({ query }) => {
    const { modifiedCount } = await productModel.updateOne(query, { $set: { isPublished: false, isDraft: true, isDeleted: false } }, { multi: true })
    return modifiedCount
}
const searchProductByUserInShopRepo = async ({ keySearch, product_shop }) => {
    const score = { score: { $meta: "textScore" } }
    const regExpSearch = new RegExp(keySearch)
    // check id shop 
    const isShop = await shopService.findById(product_shop)
    if (!isShop) throw new BadRequestError("Shop not found")
    // find all product with keyword in shop
    const result = await productModel.find({
        $and: [
            { $text: { $search: regExpSearch } },
            { product_shop: new Types.ObjectId(product_shop) },
            { isPublished: true }
        ]
    },
        score)
        .sort(score)
        .lean()
        .exec();
    return result
}
const findByIdProductRepo = async (id) => {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestError("Invalid id")
    const idProduct = new Types.ObjectId(id)
    const result = await productModel.findById(idProduct).lean()
    if (!result) throw new NotFoundError("Product not found")
    return result
}
// get all product by shop
const findAllProductByShopRepo = async ({ product_shop, limit = 25, page = 1 }) => {
    const skipNum = (page - 1) * limit;
    return await productModel.find({ product_shop: product_shop })
        .limit(limit).skip(skipNum)
        .sort({ createdAt: -1 })
        .lean()
        .exec()
}
const queryProduct = async ({ query, limit = 25, page = 1 }) => {
    const skipNum = (page - 1) * limit;

    return await productModel.find(query)
        .populate('product_shop', 'name email -_id')
        .limit(limit).skip(skipNum)
        .sort({ createdAt: -1 })
        .lean()
        .exec()
}
module.exports = {
    findAllDraftForShopRepo,
    findAllPublishForShopRepo,
    publishProductByShopRepo,
    unPublishProductByShopRepo,
    deletedProductByShopRepo,
    restoreProductByShopRepo,
    searchProductByUserInShopRepo,
    findByIdProductRepo,
    findAllProductByShopRepo

}