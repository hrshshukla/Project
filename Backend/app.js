// - Importing modules at top (best practices)
const dotenv = require('dotenv');
dotenv.config();


// - imports 
const express = require('express')
const app = express();
const cors = require('cors');
const connectToDb = require('./db/db'); // Import the database connection function
const userRoutes = require('./routes/user.routes');

connectToDb(); // - Connect to the database
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies



app.get('/', (req, res)=>{
    res.send('Hello World')
})

app.use('/users', userRoutes); // - User routes


module.exports = app; 