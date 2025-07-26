require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/article');
const feedbackRoutes = require('./routes/feedback');
const authMiddleware = require('./middlewares/authMiddleware');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());

// Serve static files
app.use('/storage', express.static(path.join(__dirname, 'storage')));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/feedback', feedbackRoutes);

// Protected route example
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.get('/', (req, res) => {
    res.send('API is running...');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
