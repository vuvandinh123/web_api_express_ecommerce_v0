'use strict';
const mongoose = require('mongoose'); // Erase if already required
const COLLECTION_NAME = 'Electronics'
const DOCUMENT_NAME = 'Electronic'

var ElectronicSchema = new mongoose.Schema({
    
    brand:{
        type:String,
        required:true
    },
    color:String,
    size:String,
    weight:Number,
    model:String,

},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, ElectronicSchema);