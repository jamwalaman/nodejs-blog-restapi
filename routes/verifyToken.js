const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {

  const token = req.header('auth-token');
  
  if (!token) {return res.status(401).send('Access denied. Please login')};

  try {
    const secretKey = req.app.get('env') === 'development' ? 'somesecretkey' : process.env.JWT_KEY;
    req.user = jwt.verify(token, secretKey);
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }

}
