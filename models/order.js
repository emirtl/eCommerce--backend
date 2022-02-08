const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    orderItems: [{ type: mongoose.Types.ObjectId, ref: 'OrderItem' }],
    firstShippingAddress: { type: String, required: true },
    secondShippingAddress: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: Number, required: true },
    zip: { type: String },
    status: {
        type: String,
        required: true,
        enum: { values: ['pending', 'shipped', 'delivered'], message: 'input is not supported' },
    },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    dateOrdered: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Order', orderSchema)