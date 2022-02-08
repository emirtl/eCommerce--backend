const errorHandler = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json('Unauthorized Error')
    }
    if (err.name === 'ValidationError') {
        return res.status(401).json('Validation Error')
    }
    return res.status(500).json('Serverside Error')
}

module.exports = errorHandler