const http = require('http');
const app = require('./app'); // Import the Express app

// Create an HTTP server
const server = http.createServer(app);

// Set the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the server for testing purposes
module.exports = server;