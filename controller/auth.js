const Mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// user

exports.users = async(req, res) => {
    try {
        const users = await User.find().select('-passwordHash').exec()
        if (!users) {
            return res.status(500).json('fetching users failed')
        }
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.user = async(req, res) => {
    if (!Mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json('fetching user failed due to a bad request')
    }
    try {
        const user = await User.findById(req.params.id).select('-passwordHash').exec()
        if (!user) {
            return res.status(500).json('fetching user failed')
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.updateUser = async(req, res) => {
    if (!Mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json('updating user failed due to a bad request')
    }
    const userExist = await User.findById(req.params.id).exec()
    let newPassword
    if (req.body.password) {
        newPassword = await bcrypt.hash(req.body.password, 12)
    } else {
        newPassword = userExist.passwordHash
    }
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, {
                username: req.body.username,
                email: req.body.email,
                passwordHash: newPassword,
                country: req.body.country,
                city: req.body.city,
                street: req.body.street,
                phone: req.body.phone,
                zip: req.body.zip,
                isAdmin: req.body.isAdmin,
            }, { new: true }
        )

        if (!user) {
            return res.status(500).json('updating user failed')
        }
        return res.status(200).json('user updated')
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deleteUser = async(req, res) => {
    if (!Mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json('fetching user failed due to a bad request')
    }
    try {
        const deletedUser = await User.findByIdAndRemove(req.params.id)
        if (!deletedUser) {
            return res.status(500).json('user deletion failed')
        }
        return res.status(200).json(' user deletion succeeded')
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.userCount = async(req, res) => {
    try {
        const users = await User.countDocuments()
        if (!users) {
            return res.status(500).json('counting users failed')
        }
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// auth

exports.register = async(req, res) => {
    try {
        const userExist = await User.findOne({ email: req.body.email }).exec()
        if (userExist) {
            return res
                .status(401)
                .json(
                    'user with these credentials already exists . You are not authorized to make this request'
                )
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        if (!hashedPassword) {
            return res
                .status(500)
                .json('user creation failed. something went wrong please try later')
        }
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            passwordHash: hashedPassword,
            country: req.body.country,
            city: req.body.city,
            street: req.body.street,
            phone: req.body.phone,
            zip: req.body.zip,
            isAdmin: req.body.isAdmin,
        })
        user = await user.save()
        if (!user) {
            return res.status(500).json('user creation failed')
        }
        return res.status(200).json('user created successfully')
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.login = async(req, res) => {
    try {
        const userExist = await User.findOne({ email: req.body.email }).exec()
        if (!userExist) {
            return res.status(401).json('can not find any user with thease credentials .')
        }
        const isMath = await bcrypt.compare(req.body.password, userExist.passwordHash)
        if (!isMath) {
            return res.status(401).json('can not find any user with thease credentials .')
        }
        const token = await jwt.sign({ email: userExist.email, isAdmin: userExist.isAdmin },
            process.env.JWT_SECRET, { expiresIn: 18000 }
        )
        if (!token) {
            return res.status(401).json('something went wrong. please try later.')
        }
        return res.status(200).json(token)
    } catch (error) {
        return res.status(500).json(error)
    }
}