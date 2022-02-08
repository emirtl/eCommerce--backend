const mongoose = require('mongoose')
const Category = require('../models/category')
const Product = require('../models/product')

exports.getAll = async(req, res) => {
    let filter = {}
    if (req.query.categories) {
        filter = {
            category: req.query.categories.split(','),
        }
    }

    try {
        const products = await Product.find(filter).populate('category').exec()
        if (!products) {
            res.status(500).json('fetching products failed')
        }
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getOne = async(req, res) => {
    if (!req.params.id) {
        res.status(500).json('fetching products failed')
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(500).json('fetching products failed')
    }
    try {
        const product = await Product.findById(req.params.id).populate('category').exec()
        if (!product) {
            res.status(500).json('fetching products failed')
        }
        product.numReviews = product.numReviews + 1
        product.save()
        return res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.insert = async(req, res) => {
    const category = Category.findById(req.body.category).exec()

    if (!category || !mongoose.isValidObjectId(req.body.category)) {
        res.status(404).json('product creation failed')
    }

    if (!req.file) {
        return res.status(400).json('image is needed')
    }
    const imagePath = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`

    try {
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagePath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        })
        product = await product.save()
        if (!product) {
            return res.status(500).json('product creation failed')
        }
        return res.status(201).json('product creation succeeded')
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.update = async(req, res) => {
    const category = Category.findById(req.body.category).exec()
    if (!category || !mongoose.isValidObjectId(req.body.category)) {
        res.status(404).json('updating product failed')
    }
    const existProduct = await Product.findById(req.params.id).exec()
    if (!existProduct) {
        res.status(500).json('updating product failed')
    }
    let image
    if (req.file) {
        const imagePath = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`
        image = imagePath
    } else {
        image = existProduct.image
    }
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            }, { new: true }
        )

        if (!product) {
            return res.status(500).json('updating product failed')
        }
        return res.status(200).json('product updated')
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.delete = async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).json('wrong category id')
    }
    try {
        const product = await Product.findByIdAndRemove(req.params.id).exec()
        if (!product) {
            return res.status(500).json('product deletion failed')
        }
        return res.status(200).json('product deletion succeeded')
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.count = async(req, res) => {
    try {
        const totalCount = await Product.countDocuments()
        if (!totalCount) {
            return res.status(500).json('total count failed')
        }
        return res.status(200).json(totalCount)
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.gallary = async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).json('wrong category id')
    }

    const imagesPath = []
    if (req.files) {
        req.files.map((file) => {
            const imagePath = `${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`
            imagesPath.push(imagePath)
        })
    }
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, {
                images: imagesPath,
            }, { new: true }
        )
        if (!product) {
            return res.status(500).json('failed to add image(s) to the gallary')
        }
        return res.status(200).json('images(s) added to the gallary')
    } catch (error) {
        return res.status(500).json(error)
    }
}

// product featured

exports.featured = async(req, res) => {
    try {
        const products = await Product.find({ isFeatured: true })
            .limit(3)
            .sort({ dateCreated: -1 })
            .exec()
        if (!products) {
            return res.status(500).json('fetching featured products failed')
        }
        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json(error)
    }
}