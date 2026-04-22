// src/routes/forum.js
const router = require('express').Router();
const { createPost, getPosts } = require('../controllers/forumController');
const protect = require('../middleware/protect');

router.use(protect);
router.get('/posts', getPosts);
router.post('/posts', createPost);

module.exports = router;
