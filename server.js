const http = require('http') // Server import

const server = http.createServer((req, res) => {
    console.log("Hello there.")
}) // Create server

const PORT = process.env.port || 5000 // Port setup, checking for enviorment variable if not use 5000.

server.listen(PORT, () => console.log(`Server running on port ${PORT}`)) // Listening for server request.

