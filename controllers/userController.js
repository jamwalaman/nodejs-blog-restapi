const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const app = require('../app');
const User = require('../models/User');


exports.user_register = [

  check('username').not().isEmpty().trim().escape().withMessage('Username is required')
    .isLength({min:4}).withMessage('The username must be at least 4 characters long')
    .isAlphanumeric().withMessage('Username should only have numbers and letters, with no space')
    .custom(value => {
    return User.findOne({username: value}).then(result => {
      if (result) {return Promise.reject(`Username ${value} is already registered. Please choose a different username`)}
    });
  }),
  check('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Email not valid').custom(value => {
    return User.findOne({email: value}).then(result => {
      if (result) {return Promise.reject(`Email ${value} is already in use. Please choose a different email`)}
    });
  }),
  check('password').not().isEmpty().withMessage('Password is required').isLength({min: 4}).withMessage('Password must be at least 4 characters long'),

  async (req, res) => {

    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
      return msg;
    };
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.mapped()});
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // No erros. Let's create a user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    try {
      const savedUser = await user.save();
      res.send({msg: 'User created successfully', id: savedUser._id, username: savedUser.username, email: savedUser.email});
    } catch (err) {
      res.status(400).send(err);
    }

  }

];


exports.user_login = [

  check('email').not().isEmpty().withMessage('Email is required'),
  check('password').not().isEmpty().withMessage('Password is required'),

  async (req, res) => {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
      return msg;
    };
    const errors = validationResult(req).formatWith(errorFormatter);
    // errors object
    const errObj = errors.mapped();
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errObj});
    }
    // Check if email exists in the database
    const user = await User.findOne({email: req.body.email});
    if (!user) {
      errObj.authfailed = "Invalid email or password";
      return res.status(422).json({errors: errObj});
    }
    // Check if the password matches the email
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      errObj.authfailed = "Invalid email or password";
      return res.status(422).json({errors: errObj});
    };
    const secretKey = req.app.get('env') === 'development' ? 'somesecretkey' : process.env.JWT_KEY;
    // Create and assign a token
    const token = jwt.sign({userid: user._id, username: user.username}, secretKey);
    res.header('auth-token', token).json({token: token});
  }

];
