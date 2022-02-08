const express = require('express')
const router = express.Router()
const controller = require('../controller/category')

router.get('/', controller.getAll)

router.get('/get/category/:id', controller.getOne)

router.get('/get/totalCount', controller.count)

router.post('/insert', controller.create)

router.put('/category/update/:id', controller.update)

router.delete('/category/delete/:id', controller.delete)

module.exports = router