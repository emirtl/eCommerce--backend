const express = require('express')

const router = express.Router()
const controller = require('../controller/auth')

// users routes

router.get('/get/users', controller.users)

router.get('/get/user/:id', controller.user)

router.put('/update/user/:id', controller.updateUser)

router.delete('/delete/user/:id', controller.deleteUser)

router.get('/get/users/count', controller.userCount)

// auth routes

router.post('/register', controller.register)

router.post('/login', controller.login)

module.exports = router