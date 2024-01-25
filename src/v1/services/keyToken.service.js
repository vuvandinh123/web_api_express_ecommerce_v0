'use strict'

const keytokenModel = require("../models/keytoken.model")
const {Types} = require('mongoose')
class KeyTokenService {
    static createKetToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        // const tokens = await keytokenModel.create({ user: userId, publicKey, privateKey })
        // return tokens ? tokens.publicKey : null
        const filter = { user: userId }
        const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken }
        const options = { upsert: true, new: true }
        const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
        return tokens ? tokens.publicKey : null
    }
    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: userId })
    }
    
    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({_id:id})
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed:refreshToken})
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken})
    }
    static removeKeyById = async (userId) => {
        return await keytokenModel.deleteOne({user:userId})
    }
}
module.exports = KeyTokenService