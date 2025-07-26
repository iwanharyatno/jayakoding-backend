require('dotenv').config();
const mongoose = require('mongoose');
const prompts = require('prompts');
const User = require('./models/user');

const questions = [
    {
        type: 'text',
        name: 'username',
        message: 'Enter username:'
    },
    {
        type: 'password',
        name: 'password',
        message: 'Enter password:'
    }
];

const addUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const response = await prompts(questions);

        const { username, password } = response;

        if (!username || !password) {
            console.log('Username and password are required.');
            process.exit(1);
        }

        let user = await User.findOne({ username });
        if (user) {
            console.log('User already exists.');
            process.exit(1);
        }

        user = new User({
            username,
            password
        });

        await user.save();
        console.log('User created successfully!');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
        process.exit(0);
    }
};

addUser();
