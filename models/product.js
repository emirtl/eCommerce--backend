const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    images: [{ type: String }],
    brand: {
        type: String,
        required: true,
    },
    price: { type: String, required: true },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    countInStock: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Product', productSchema)