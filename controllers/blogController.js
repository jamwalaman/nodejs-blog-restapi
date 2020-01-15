const { check, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const app = require('../app');


exports.blogs_list = function (req, res) {

  Blog.find()
  .sort([ ['createdAt', 'descending'] ])
  .populate('author', '_id username')
  /* Only get the _id and username fields.
  Not adding this second argument will return ALL the fields in the User model (including the email and hashed password)
  which users don't need to see */
  .exec(function (err, blogs) {
    if (err) {return res.status(400).send(err)}
    if (!blogs.length) {return res.send('No blogs at the moment')}
    res.json(blogs);
  })

};


exports.blog_create = [

  check('title').not().isEmpty().trim().escape().withMessage('Title is required'),
  check('content').not().isEmpty().trim().escape().withMessage('Content is required'),

  (req, res) => {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
      return msg;
    };
    const errors = validationResult(req).formatWith(errorFormatter);
    // errors object
    const errObj = errors.mapped();
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errObj});
    }

    // No errors, so create the blog and save it
    const blog = new Blog ({
      title: req.body.title,
      content: req.body.content,
      author: req.user.userid
    });
    blog.save(function (err) {
      if (err) {return res.status(400).send(err)}
      return res.json(blog);
    });
  }

];


exports.blog_detail = function (req, res, next) {

  Blog.findById(req.params.id)
  .populate('author', '_id username')
  .exec(function (err, blog) {
    if (err && (req.app.get('env') === 'development')) {return res.status(400).json(err)}
    if (blog==null) {
      const err = new Error('Blog not found');
      err.status = 404;
      return next(err);
    }
    res.json(blog);
  })

};


exports.blog_update = [

  check('title').trim().escape(),
  check('content').trim().escape(),

  (req, res, next) => {

    Blog.findById(req.params.id)
    .populate('author')
    .exec(function (err, blog) {
      // Send an error if blog not found
      if (err && (req.app.get('env') === 'development')) {return res.status(400).send(err)}
      if (blog==null) {
        const err = new Error('Blog not found');
        err.status = 404;
        return next(err);
      }
      // Send error if user tries to update someone else blog
      if(blog.author._id != req.user.userid) {
        return res.status(403).send("Can't update another user's blog")
      }
      // User created the blog, so they can update. Now check if the data is valid
      const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return `${param}: ${msg}`;
      };
      const errors = validationResult(req).formatWith(errorFormatter);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array({onlyFirstError: true}) });
      }
      const updatedBlog = {};
      // The title and content isn't required. So the default value for both will be whatever is in the blog object
      updatedBlog.title = (req.body.title) ? req.body.title : blog.title;
      updatedBlog.content = (req.body.content) ? req.body.content : blog.content;
      // Data is valid. Update the record
      Blog.updateOne({_id: req.params.id}, updatedBlog, function (err, result) {
        if (err) {return res.status(400).send(err)}
        return res.status(204).json()
      })
    })

  }

];


exports.blog_delete = function (req, res, next) {

  Blog.findById(req.params.id)
  .populate('author')
  .exec(function (err, blog) {
    // Send an error if blog not found
    if (err && (req.app.get('env') === 'development')) {return res.status(400).send(err)}
    if (blog==null) {
      const err = new Error('Blog not found');
      err.status = 404;
      return next(err);
    }
    // Send error if user is logged in, but didn't create the blog
    if(blog.author._id != req.user.userid) {
      return res.status(403).send("Can't delete another user's blog")
    }
    // The user created the blog, so they can delete it
    Blog.deleteOne({_id: req.params.id}, function (err) {
      if (err) {return res.status(400).send(err)}
      return res.status(204).json();
    })
  })

};
