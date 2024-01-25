'use strict';
const mongoose = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Clothing'
const COLLECTION_NAME = 'Clothings'
// Declare the Schema of the Mongo model
var ClothingSchema = new mongoose.Schema({
    
    brand:{
        type:String,
        required:true
    },
    size:String,
    color:String,
    material:String,

},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, ClothingSchema);