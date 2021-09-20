const http = require('http') // Server import

const server = http.createServer((req, res) => {
    console.log("Hello there.")
}) // Create server

const PORT = process.env.port || 5000 // Port setup, checking for enviorment variable if not use 5000.

server.listen(PORT, () => console.log(`Server running on port ${PORT}`)) // Listening for server request.

// TODOs
// Create a GET route that loads a message on how to format a request using
// parameters in order to interact with the location and weather features of
// our API. The GET route will be placed on the '/' route and any incorrectly
// formatted route.
// Example route: 'localhost:5000/'
// or a nonvalid route of 'localhost:5000/icecream/'

// Create a POST route that will send return all weather data for the location
// that is found in our weather.json (Apopka). Requesting any other city should
// send back a response that 'This city is currently not supported.'
// Example route: 'localhost:5000/weather/apopka/

// Create a POST route that will send the weather data for a specific hour from
// the matched hour parameter (based on a 24 hour clock). Requesting an hour
// outside of the time range available in weather.json should send back a
// response that 'No data for this time is available.'
// Example route: 'localhost:5000/weather/apopka/hour?time=19'

// Create a POST route that will send the weather data for a location and
// a specific hour parameter (based on a 24 hour clock). Requesting an hour
// or location outside of available data in weather.json should send back a
// response describing which of the parameters was either "invalid" or 
// that 'No data for this time/ location is availble.'

// Create a GET route that loads a message on how to use the time range
// parameters in order to get the weather data for the hours requested. 
// A request to '/hours' or 'hours/' with wrong parameters should use
// this message.
// Message:
// Input your starting hour (24 hour clock) in place of starthour value
// and your ending hour (24 hour clock) in place of endinghour value.
// If the 'from' parameter is valid and data for the hour is available
// but the 'to' parameter is invalid or there is no data for that hour
// available the default will send data to the last hour available. 