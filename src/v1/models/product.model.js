'use strict'
const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify')
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
        unique: true,
    },
    product_slug: {
        type: String,
        unique: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Clothing', 'Electronics', 'Furniture', 'Books', 'Others'],
    },
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_attributes: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    product_rating: {
        type: Number,
        default: 4.5,
        min: 1,
        max: 5,
        set: (val) => Math.round(val * 10) / 10
    },
    product_variants: {
        type: Array,
        default: [],
    },
    isPublished: {
        type: Boolean,
        default: false,
        select: false
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
productSchema.index({ product_name: 'text', product_description: 'text' });
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, productSchema);