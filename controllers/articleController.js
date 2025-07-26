const Article = require('../models/article');
const fs = require('fs');
const path = require('path');

const getPublicUrl = (filePath) => {
    if (!filePath) return null;
    // Replace backslashes with forward slashes for URL compatibility
    const urlPath = filePath.replace(/\\/g, '/');
    return `${process.env.APP_URL || 'http://localhost:5000'}/${urlPath}`;
};

// Helper to add public url to article object
const toArticleResponse = (article, options = {}) => {
    const { truncateContent = false } = options;
    const articleObj = article.toObject();
    articleObj.cover_image_public = getPublicUrl(article.cover_image);

    if (truncateContent) {
        const words = articleObj.content.split(' ');
        if (words.length > 20) {
            articleObj.content = words.slice(0, 20).join(' ') + '...';
        }
    }

    return articleObj;
};


// Create a new article
exports.createArticle = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ message: 'Title, content, and category are required' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Cover image is required' });
        }
        if (!['project', 'article'].includes(category)) {
            return res.status(400).json({ message: 'Valid category (project or article) is required' });
        }
        const cover_image = req.file.path;

        const article = new Article({
            title,
            content,
            cover_image,
            category
        });

        await article.save();
        
        res.status(201).json(toArticleResponse(article));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all articles
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        const articlesWithPublicUrl = articles.map(article => toArticleResponse(article, { truncateContent: true }));
        res.json(articlesWithPublicUrl);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get articles by category
exports.getArticlesByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        if (!['project', 'article'].includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        const articles = await Article.find({ category }).sort({ createdAt: -1 });
        const articlesWithPublicUrl = articles.map(article => toArticleResponse(article, { truncateContent: true }));
        res.json(articlesWithPublicUrl);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get a single article by ID
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(toArticleResponse(article));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an article
exports.updateArticle = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        let article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // If a new file is uploaded, update the cover_image and delete the old one
        if (req.file) {
            // Delete old image
            if (article.cover_image) {
                fs.unlink(path.join(__dirname, '..', article.cover_image), (err) => {
                    if (err) {
                        console.error("Error deleting old image:", err);
                    }
                });
            }
            article.cover_image = req.file.path;
        }

        article.title = title || article.title;
        article.content = content || article.content;
        article.category = category || article.category;


        await article.save();
        res.json(toArticleResponse(article));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an article
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Delete image from storage
        if (article.cover_image) {
            fs.unlink(path.join(__dirname, '..', article.cover_image), (err) => {
                if (err) {
                    console.error("Error deleting image:", err);
                }
            });
        }

        await article.deleteOne();

        res.json({ message: 'Article removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
