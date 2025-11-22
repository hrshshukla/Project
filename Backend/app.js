// - Importing modules at top best practices
const dotenv = require('dotenv');
dotenv.config();


// - basic imports 
const express = require('express')
const app = express();


// - cors setup
const cors = require('cors');
app.use(cors());


app.get('/', (req, res)=>{
    res.send('Hello World')
})


module.exports = app; 