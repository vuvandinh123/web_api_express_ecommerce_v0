'use strict'

const { CREATED, OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    signIn = async (req, res, next) => {
        new OK({
            message: "Sing in success",
            data: await AccessService.signIn(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: "Sing up success",
            data: await AccessService.signUp(req.body)
        }).send(res)
    }
    logOut = async (req, res, next) => {
        new OK({
            message: "Sing out success",
            data: await AccessService.logOut(req.keyStore)
        }).send(res)
    }
    refreshToken = async (req, res, next) => {
        new OK({
            message: "Refresh token success",
            data: await AccessService.handleRefreshToken({
                keyStore: req.keyStore,
                refreshToken: req.refreshToken,
                user: req.user
            })
        }).send(res)
    }
}
module.exports = new AccessController()