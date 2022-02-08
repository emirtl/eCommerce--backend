const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    country: { type: String },
    city: { type: String },
    street: { type: String },
    phone: { type: Number },
    zip: { type: String },
    isAdmin: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now },
})

mongoose.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)