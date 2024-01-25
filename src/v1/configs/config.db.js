require('dotenv').config()
const development = {
    app: {
        port: process.env.DEV_APP_PORT || 8000
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'db_name'
    }
}
const production = {
    app: {
        port: process.env.PROD_APP_PORT || 8080
    },
    db: {
        host: process.env.PROD_DB_HOST || 'localhost',
        port: process.env.PROD_DB_PORT || 27017,
        name: process.env.PROD_DB_NAME || 'db_name_prod'
    }
}
const config = { development, production}
const env = process.env.NODE_ENV || 'development'
module.exports = config[env]