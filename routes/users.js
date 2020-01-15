const router = require('express').Router();
const user_controller = require('../controllers/userController');

// '/api/user/register'
router.post('/register', user_controller.user_register);

// '/api/user/login'
router.post('/login', user_controller.user_login);

module.exports = router;
