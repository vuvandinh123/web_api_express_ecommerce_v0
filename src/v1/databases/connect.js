'use strict'

const mongoose = require('mongoose');
require('dotenv').config()
const { countConnect } = require('../helpers/check.connect')
const config = require('../configs/config.db');
const connectString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;

class Database {
    constructor() {
        this.connect()
    }
    connect(type = 'mongodb') {
        mongoose.connect(connectString, { maxPoolSize: 50 }).then(() => {
            console.log('Database connected successfully', connectString);

            countConnect()
        }).catch(err => {
            console.log('connection failed');
        })
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}
const database = Database.getInstance()
module.exports = database 