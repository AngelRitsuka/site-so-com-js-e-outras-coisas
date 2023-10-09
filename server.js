const http = require('http');


app.use(express.static(path.join(__dirname, "public")));

// Create an HTTP server
const server = http.createServer((req, res) => {
// Set the response status and headers
res.writeHead(200, { 'Content-Type': 'text/html' });

// Write the HTML content to the response
res.write('<h1>Hello, World!</h1>');

// End the response
res.end();
});


// Listen on port 3000
const port = 5000;
server.listen(port, () => {
console.log(`Server is running on port ${port}`);
});