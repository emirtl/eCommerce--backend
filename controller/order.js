const Mongoose = require('mongoose')
const Order = require('../models/order')
const OrderItem = require('../models/order-item')

exports.Orders = async(req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
            .exec()
        if (!orders) {
            return res.status(500).json('fetching orders failed')
        }
        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.getOrder = async(req, res) => {
    if (!Mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json('bad request. fetching order failed')
    }
    try {
        const order = await Order.findById(req.params.id).exec()
        if (!order) {
            return res.status(500).json('no order was found')
        }
        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.order = async(req, res) => {
    const orderItemsIds = await Promise.all(
        req.body.orderItems.map(async(orderItem) => {
            const newOrderItem = new OrderItem({
                product: orderItem.product,
                quantity: orderItem.quantity,
            })
            await newOrderItem.save()
            return newOrderItem._id
        })
    )
    const orderItemsIdsResolve = await orderItemsIds

    const totalPrices = await Promise.all(
        orderItemsIdsResolve.map(async(orderItem) => {
            const newOrderItem = await OrderItem.findById(orderItem)
                .populate('product', 'price')
                .exec()
            return newOrderItem.quantity * newOrderItem.product.price
        })
    )

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

    try {
        let order = new Order({
            orderItems: orderItemsIdsResolve,
            firstShippingAddress: req.body.firstShippingAddress,
            secondShippingAddress: req.body.secondShippingAddress,
            country: req.body.country,
            city: req.body.city,
            phone: req.body.phone,
            zip: req.body.zip,
            status: req.body.status,
            totalPrice,
            user: req.body.user,
        })
        order = await order.save()
        if (!order) {
            return res.status(500).json('order creation failed')
        }
        return res.status(200).json('order creation succeeded')
    } catch (error) {
        return res.status(500).json(error)
    }
}
exports.changeStatus = async(req, res) => {
    if (!Mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json('bad request. changing status failed')
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, { status: req.body.status }, { new: true }
        )
        if (!updatedOrder) {
            return res.status(500).json('failed to update status')
        }
        res.status(200).json('status updated')
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.deleteOrder = async(req, res) => {
    if (!Mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json('bad request. deleting order failed')
    }
    try {
        const order = await Order.findByIdAndRemove(req.params.id).exec()
        if (!order) {
            return res.status(500).json('deleting order failed')
        }
        if (order) {
            order.orderItems.map(async(orderItem) => {
                const newOrderItem = await OrderItem.findByIdAndRemove(orderItem)
                if (!newOrderItem) {
                    return res.status(500).json('deleting orderitem failed')
                }
            })
        }
        return res.status(200).json('order deleted')
    } catch (error) {
        return res.status(200).json(error)
    }
}

exports.totalSales = async(req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
        ])

        if (!totalSales) {
            return res.status(500).send('The order sales cannot be generated')
        }
        return res.send({ totalSales: totalSales.pop().totalsales })
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.orderCount = async(req, res) => {
    try {
        const orderCount = await Order.countDocuments().exec()
        if (!orderCount) {
            return res.status(500).json('no order where found')
        }
        return res.status(200).json(orderCount)
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.userOrderList = async(req, res) => {
    try {
        const userOrderList = await Order.find({ user: req.params.id }).exec()
        if (!userOrderList) {
            return res.status(500).json('no orders for this user found')
        }
        return res.status(500).json(userOrderList)
    } catch (error) {
        return res.status(500).json(error)
    }
}