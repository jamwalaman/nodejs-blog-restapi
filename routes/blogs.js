const router = require('express').Router();
const blog_controller = require('../controllers/blogController');
const auth = require('./verifyToken');

// GET '/api/blogs' Get a list of all blogs
router.get('/', blog_controller.blogs_list);

// POST '/api/blogs/create' Create a blog
router.post('/create', auth, blog_controller.blog_create);

// GET '/api/blogs/:id' Read a blog
router.get('/:id', blog_controller.blog_detail);

// PUT '/api/blogs/:id' Update a blog
router.put('/:id', auth, blog_controller.blog_update);

// '/api/blogs/:id' Delete a blog
router.delete('/:id', auth, blog_controller.blog_delete);

module.exports = router;
