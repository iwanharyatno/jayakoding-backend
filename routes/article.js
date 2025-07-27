const express = require('express');
const router = express.Router();
const {
    createArticle,
    getAllArticles,
    getArticlesByCategory,
    getArticleById,
    updateArticle,
    deleteArticle
} = require('../controllers/articleController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// @route   POST api/articles
// @desc    Create an article
// @access  Private
router.post('/', authMiddleware, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        createArticle(req, res);
    });
});

// @route   GET api/articles
// @desc    Get all articles
// @access  Public
router.get('/', getAllArticles);

// @route   GET api/articles/:category
// @desc    Get articles by category
// @access  Public
router.get('/:category', getArticlesByCategory);

// @route   GET api/articles/:id
// @desc    Get a single article by ID
// @access  Public
router.get('/detail/:id', getArticleById);

// @route   PUT api/articles/:id
// @desc    Update an article
// @access  Private
router.put('/:id', authMiddleware, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        updateArticle(req, res);
    });
});

// @route   DELETE api/articles/:id
// @desc    Delete an article
// @access  Private
router.delete('/:id', authMiddleware, deleteArticle);

module.exports = router;
