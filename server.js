const http = require('http')
const url = require('url')
const UrlPattern = require('url-pattern')

const {homeRouteInstructions} = require('./controller/index')
const {evaluateWeatherURL} = require('./controller/weatherController')

//  Create server
const server = http.createServer((req, res) => {
    console.log("Console log req.url:" + req.url)
    console.log("Console log url split, / (home route):" + req.url.split('/')[1])
    console.log("Console log url split, weather:" + req.url.split('/')[1])

    const myURL = new URL(req.url, `http://${req.headers.host}`)
    const locationURL = new UrlPattern('/location(/:anything)')

    console.log("Hello there.")
    console.log("myURL:", myURL)

    //  Checks if the req.url matches 'weather' after host and the request method
    //  equals GET
    if (req.url.split('/')[1] === 'weather' && req.method === 'GET') { 
        //  Sends a welcome message along with instructions on how to use ZBK's api
        evaluateWeatherURL(req, res)
    }
    //  Checks if the req.url matches locationURL, url pattern, and the request
    //  method equals GET
    else if (locationURL.match(req.url) && req.method === 'GET') { 
        //  Sends a JSON object with a message saying "Currently not supported"
        res.writeHead(400, {"Content-Type": "application/json"})
        res.end(JSON.stringify({"message" : "Currently not supported" }))
    } 
    //  An else if statement to prevent home route requests from going any further
    //  in application other than a quick call too get homeRouteInstructions. The rest
    //  of URL routing will be done by evaluateWeatherURL.
    else if (myURL.pathname === '/' && req.method === 'GET') {
        
        console.log("server.js - home route host request:", myURL.host)
        console.log("server.js - home route path request", myURL.pathname)
        homeRouteInstructions(req, res)
    } 
    //  Checks if the request method is something other than GET
    else if (req.method !== 'GET') {
        //  Sends a error message saying use only GET request with a 405 code
        res.writeHead(405, {"Content-Type": "application/json"})
        res.end(JSON.stringify({"message": "Please use only GET request."}))
    } else { 
        //  Sends a error message with a 404 code
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end(JSON.stringify({"message": 'Route Not Found' }))
    }
})

// Port setup, checking for enviorment variable if not use 5000
const PORT = process.env.port || 5000 

//  Listening for server request
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)) 

// [Original] TODOs
// Create a route that loads a message on how to format a request using
// parameters in order to interact with the location and weather features of
// our API. The GET route will be placed on the '/' route and any incorrectly
// formatted route.
// Example route: 'localhost:5000/'
// or a nonvalid route of 'localhost:5000/icecream/'

// Create a GET route that returns all weather data.
// Example route: 'localhost:5000/weather/all/'

// Create a GET route that will send return all weather data for the location
// that is found in our weather.json (Apopka). Requesting any other city should
// send back a response that 'This city is currently not supported.'
// Example route: 'localhost:5000/weather/apopka/

// Create a GET route that will send the weather data for a specific hour from
// the matched hour parameter (based on a 24 hour clock). Requesting an hour
// outside of the time range available in weather.json should send back a
// response that 'No data for this time is available.'
// Example route: 'localhost:5000/weather/apopka/hour?time=19'

// Create a GET route that will send the weather data for a location and
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