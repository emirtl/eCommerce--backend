const express = require('express')

const router = express.Router()
const controller = require('../controller/order')

router.get('/', controller.Orders)

router.get('/get/order/:id', controller.getOrder)

router.get('/count', controller.orderCount)

router.get('/totalSales', controller.totalSales)

router.get('/user-order-list/:id', controller.userOrderList)

router.post('/order', controller.order)

router.put('/update/status/:id', controller.changeStatus)

router.delete('/delete/:id', controller.deleteOrder)

module.exports = router