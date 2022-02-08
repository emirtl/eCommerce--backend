const expressJwt = require('express-jwt')

async function isRevokedCallBack(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true)
    }

    done()
}

function authJwt() {
    const { JWT_SECRET } = process.env
    const { API } = process.env
    return expressJwt({
        algorithms: ['HS256'],
        secret: JWT_SECRET,
        isRevoked: isRevokedCallBack,
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/auth(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS'] },
            `${API}/auth/register`,
            `${API}/auth/login`,
        ],
    })
}

module.exports = authJwt