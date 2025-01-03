const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = async () => {
    try {
        // Use environment variable for MongoDB URI if defined, fallback to local DB
        //const mongoURI = "mongodb://localhost:27017/runner";
        const mongoURI = process.env.MONGODB_URI
        // Connect to MongoDB using mongoose without deprecated options
        await mongoose.connect(mongoURI);

        console.log('MongoDB connected');
    } catch (error) {
        // Log specific error message if available
        console.error('Error connecting to MongoDB:', error.message);

        // Exit the process with an error code
        process.exit(1);
    }
};

module.exports = connectDB;
