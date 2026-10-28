const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization') || '';
  const match = authHeader.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'A valid Bearer token is required' });
  }

  try {
    const decoded = jwt.verify(match[1], process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
