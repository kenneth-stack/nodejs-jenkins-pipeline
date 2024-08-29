const express = require('express');
const app = express();
const hostname = '0.0.0.0'; // Bind to all network interfaces
const port = 5000;

const version = '1.0.0';

// Define a function to start the server
function startServer() {
    return app.listen(port, () => {
        console.log(`[Version ${version}]: Server running at http://${hostname}:${port}/`);
    });
}

app.get('/', (req, res) => {
    // set response content    
    res.sendFile(__dirname + "/html/index.html"); 
    console.log(`[Version ${version}]: New request => http://${hostname}:${port}`+req.url);
});

// Health check
app.get('/health', (req, res) => {    
    res.sendStatus(200);
    console.log(`[Version ${version}]: New request => http://${hostname}:${port}`+req.url);
});

// Export the app and startServer function
module.exports = { app, startServer };
