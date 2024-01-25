'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("node:crypto")
const keytokenModel = require("../models/keytoken.model")
const KeyTokenService = require("./keyToken.service")
const { createTokenPeir, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const roles = {
    SHOP: 'SHOP',
    ADMIN: 'ADMIN',
    USER: 'USER'
}
const createPrivateKeyAndPublicKey = (size = 64) => {
    const privateKey = crypto.randomBytes(size).toString('hex')
    const publicKey = crypto.randomBytes(size).toString('hex')
    return { privateKey, publicKey }
}
class AccessService {

    // refreshtoken 
    static handleRefreshToken = async ({ keyStore, refreshToken, user }) => {
        const { userId, email } = user;

        if (keyStore && keyStore.refreshTokensUsed.includes(refreshToken)) {
            const { userId, email } = await verifyJWT(refreshToken, keyStore.privateKey)
            console.log({ userId, email });
            await KeyTokenService.removeKeyById(userId)
            throw new ForbiddenError("Refresh token has been used")
        }
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError("Shop not found")

        // check userid
        const foundShop = await findByEmail(email)
        if (!foundShop) throw new AuthFailureError("Shop not found ")

        // create new token
        const tokens = await createTokenPeir({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        // update token dbs
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })
        return {
            shop: getInfoData({ fileds: ['_id', 'email', 'name'], object: foundShop }),
            token: tokens
        }
    }

    static logOut = async (keyStore) => {
        return await KeyTokenService.removeKeyById(keyStore._id)
    }
    static signIn = async ({ email, password, refreshToken = null }) => {
        const shop = await findByEmail(email)
        if (!shop) {
            throw new ForbiddenError("Shop not exists")
        }
        const isMatch = await bcrypt.compare(password, shop.password)
        if (!isMatch) throw new AuthFailureError("Password not match")
        // create key publickey and privatekey 
        const { privateKey, publicKey } = createPrivateKeyAndPublicKey()
        const token = await createTokenPeir({ userId: shop._id, email }, publicKey, privateKey, refreshToken)
        await KeyTokenService.createKetToken({
            userId: shop._id,
            publicKey,
            privateKey,
            refreshToken: token.refreshToken
        })
        return {
            shop: getInfoData({ fileds: ['_id', 'email', 'name'], object: shop }),
            token,
        }
    }
    // sign up
    static signUp = async ({ email, name, password }) => {
        const hoderShop = await shopModel.findOne({ email }).lean()
        // check email is exists
        if (hoderShop) {
            throw new BadRequestError("Shop already exists")
        }
        const passwordHast = await bcrypt.hash(password, 10)
        // create new shop
        const newShop = await shopModel.create(
            { email, name, password: passwordHast, roles: [roles.SHOP] }
        )
        if (!newShop) {
            throw new BadRequestError("Shop create error")
        }
        // create key publickey and privatekey
        const { privateKey, publicKey } = createPrivateKeyAndPublicKey()
        // create token
        const token = await createTokenPeir({ userId: newShop._id, email }, publicKey, privateKey)
        // add key publickey and privatekey to database
        const keyStore = await KeyTokenService.createKetToken({
            userId: newShop._id,
            publicKey,
            privateKey,
            refreshToken: token.refreshToken
        })
        if (!keyStore) {
            throw new BadRequestError("Key Store key error")
        }
        return {
            shop: getInfoData({ fileds: ['_id', 'email', 'name'], object: newShop }),
            token,
        }
    }
}
module.exports = AccessService