import jwt from 'jsonwebtoken'

export function authMiddleware(req, _res, next) {
  try {
    const header = req.headers['authorization'] || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return next()
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    req.userId = payload.userId
  } catch (_) {
    // ignore invalid token; routes can still use x-user-id fallback
  }
  next()
}

