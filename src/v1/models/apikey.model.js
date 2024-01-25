'use strict'
const mongoose = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = 'apiKey'
const COLLECTION_NAME = 'ApiKeys'
// Declare the Schema of the Mongo model
// !mdbgum
var apiKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);