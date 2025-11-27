// - Importing modules at top (best practices)
const dotenv = require('dotenv');
dotenv.config();


// - imports 
const express = require('express')
const app = express();
const cors = require('cors');
const connectToDb = require('./db/db'); // Import the database connection function

connectToDb(); // - Connect to the database
app.use(cors());


app.get('/', (req, res)=>{
    res.send('Hello World')
})


module.exports = app; 