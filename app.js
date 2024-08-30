const express = require('express');
const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000

const version = '1.0.0';

// Define a function to start the server
function startServer() {
    return app.listen(port, '0.0.0.0', () => {
        console.log(`[Version ${version}]: Server running at http://0.0.0.0:${port}/`);
    });
}

app.get('/', (req, res) => {
    // set response content    
    res.sendFile(__dirname + "/html/index.html"); 
    console.log(`[Version ${version}]: New request => ${req.protocol}://${req.get('host')}${req.url}`);
});

// Health check
app.get('/health', (req, res) => {    
    res.sendStatus(200);
    console.log(`[Version ${version}]: New request => ${req.protocol}://${req.get('host')}${req.url}`);
});

// Export the app and startServer function
module.exports = { app, startServer };

// If this file is run directly, start the server
if (require.main === module) {
    startServer();
}