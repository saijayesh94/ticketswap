import jwt from 'jsonwebtoken'

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.sendStatus(401)
  }
  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) {
      return res.sendStatus(403)
    }
    // req.body = user
    req.user = user
    next()
  })
}

export {
  authenticateToken
}