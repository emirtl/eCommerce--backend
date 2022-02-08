const multer = require('multer')
const express = require('express')

const router = express.Router()
const controller = require('../controller/product')

const MIME_TYPE = {
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/png': 'png',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype]
        let error = new Error('file format is not an image')
        if (isValid) {
            error = null
        }
        cb(error, 'public/uploads')
    },
    filename: (req, file, cb) => {
        const name = `${file.originalname.toLocaleLowerCase().split('.')[0]}`
        const uniqueSuffix = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const ext = MIME_TYPE[file.mimetype]
        cb(null, `${uniqueSuffix}-${name}.${ext}`)
    },
})

router.get('/', controller.getAll)

router.get('/get/product/:id', controller.getOne)

router.get('/get/count', controller.count)

router.get('/get/featured', controller.featured)

router.post('/insert', multer({ storage }).single('image'), controller.insert)

router.put('/product/update/:id', multer({ storage }).single('image'), controller.update)

router.delete('/product/delete/:id', controller.delete)

router.put(
    '/product/update-gallary/:id',
    multer({ storage }).array('images', 10),
    controller.gallary
)

module.exports = router