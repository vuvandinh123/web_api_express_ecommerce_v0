'use strict'

const { BadRequestError, AuthFailureError, NotFoundError } = require("../core/error.response");
const asyncHandler = require("../middlewares/asyncHandle");
const { findById } = require("../services/apiKey.service");
const { findByUserId } = require("../services/keyToken.service");
const JWT = require('jsonwebtoken')
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTH: 'auth',
    REFRESH_TOKEN: 'x-refresh-token'
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).send({
                code: 403,
                message: "Forbidden Error",
            })
        }
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).send({
                code: 403,
                message: "Forbidden Error",
            })
        }
        req.objKey = objKey;
        return next()
    } catch (error) {
        console.log(error);
        return error
    }
}
const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).send({
                code: 403,
                message: "Forbidden Error",
            })
        }
        if (!req.objKey.permissions.includes(permission)) {
            return res.status(403).send({
                code: 403,
                message: "Forbidden Error",
            })
        }
        return next()
    }
}
const authencation = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new NotFoundError("User Id not found")
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError("Key not found")

    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]?.toString();
    if (!refreshToken) throw new BadRequestError("Key not found")
    try {
        const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError("User Id not match")
        req.keyStore = keyStore
        req.refreshToken = refreshToken
        req.user = decodeUser
        return next()
    } catch (error) {
        console.log(error);
        throw error
    }

})
module.exports = {
    apiKey,
    checkPermission,
    authencation
}