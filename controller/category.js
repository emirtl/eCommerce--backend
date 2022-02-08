const Category = require('../models/category')
const mongoose = require('mongoose')

exports.getAll = async(req, res) => {
    try {
        const categories = await Category.find().exec()
        if (!categories) {
            return res.status(500).json('fetching categories failed')
        }
        res.status(200).json(categories)
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.getOne = async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).json('wrong category id')
    }
    try {
        const category = await Category.findById(req.params.id).exec()
        if (!category) {
            return res.status(500).json('fetching categories failed')
        }
        res.status(200).json(category)
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.create = async(req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        })
        category = await category.save()

        if (!category) {
            return res.status(500).json('category creation failed')
        }
        return res.status(201).json('category creation succeeded')
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.update = async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).json('wrong category id')
    }
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id, {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color,
            }, { new: true }
        )

        if (!category) {
            return res.status(500).json('updating category failed')
        }
        return res.status(200).json(category)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.delete = async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).json('wrong category id')
    }
    try {
        const category = await Category.findByIdAndRemove(req.params.id).exec()
        if (!category) {
            return res.status(500).json('category deletion failed')
        }
        return res.status(200).json('category deletion succeeded')
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.count = async(req, res) => {
    try {
        const totalCount = await Category.countDocuments()
        if (!totalCount) {
            return res.status(500).json('total count failed')
        }
        return res.status(200).json(totalCount)
    } catch (error) {
        return res.status(500).json(error)
    }
}