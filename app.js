const express = require('express')
const path = require('path')

const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const auth = require('./middleware/jwt-auth')
const error = require('./middleware/error')

require('dotenv').config()

// middlewares

app.use(morgan('tiny'))
app.use(express.json())
app.use(helmet())
app.use(auth())
app.use('/public/uploads', express.static(path.join('public/uploads')))

// routes

const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const authRoutes = require('./routes/auth')
const orderRoutes = require('./routes/order')

app.use(`${process.env.API}/categories`, categoryRoutes)
app.use(`${process.env.API}/products`, productRoutes)
app.use(`${process.env.API}/auth`, authRoutes)
app.use(`${process.env.API}/orders`, orderRoutes)
app.use(error)

// port

app.listen(3000, () => {
    console.log('server connected to http://localhost:3000')
})

// datebase

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGOOSE_USERNAME}:${process.env.MONGOOSE_PASSWORD}@cluster0.4mfpi.mongodb.net/${process.env.MONGOOSE_DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log('connected to DB')
    })
    .catch((err) => {
        console.log(err)
    })