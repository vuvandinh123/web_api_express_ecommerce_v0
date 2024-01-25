'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require("crypto")
const findById = async (key) => {
    // const newKey = await apikeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permissions: ['0000'] })
    // console.log(newKey);
    const result = await apikeyModel.findOne({ key: key, status: true }).lean()
    return result
}
module.exports = {
    findById
}