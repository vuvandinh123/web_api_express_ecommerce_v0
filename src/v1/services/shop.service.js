'use strict'
const shopModel = require("../models/shop.model")

const findByEmail = async (email, select = {
    password: 2, email: 1, name: 1, status: 1, roles: 1
}) => {
    return await shopModel.findOne({ email }).select(select).lean()
}
const findById = async (id, select = {
    password: 2, email: 1, name: 1, status: 1, roles: 1
})=>{
    return await shopModel.findById(id).select(select).lean()
}
module.exports = {
    findByEmail,
    findById
}