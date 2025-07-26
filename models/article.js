const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    cover_image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['project', 'article']
    }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
