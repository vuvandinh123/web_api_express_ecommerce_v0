'use strict';

const JWT = require('jsonwebtoken')
const createTokenPeir = async (payload,publicKey,privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '5 days',
        })
        JWT.verify(accessToken, publicKey,(err, decoded) => {
            if (err) {
                console.error("Error verify token::", err);
            }
            console.log("Decoded token::", decoded);
        })
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        
    }
}
const verifyJWT = async (token,keySecret) => {
    return await JWT.verify(token, keySecret)
}
module.exports = {
    createTokenPeir,
    verifyJWT
}