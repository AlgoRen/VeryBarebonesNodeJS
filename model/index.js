//  Model for returning data from the data folder that has to deal with 
//  instructions, error handling, and other misc. uses.

const { readFile, readFileSync } = require('fs')
const path = require('path')
const pathToMainRoute = '../data/instructions/main_route.txt'

//  Read instructions from passed in route with fs.readFile
function readData(route) { 
    let instructions = readFileSync(path.join(__dirname, route), 'utf8')
    console.log("readData scope index.js: \n" + instructions)
    return instructions
}

//  Gets instructions by passing in the route to main_route.txt into the
//  readData function, resolves getMainRouteInstructions with the text data.
function getMainRouteInstructions() {
    return new Promise((resolve, reject) => {
        let mainRouteInstructions = readData(route = pathToMainRoute)
        console.log("getmainRouteInstructions scope: \n" + mainRouteInstructions)
        resolve(mainRouteInstructions)
        reject('Something went wrong.')
    })
}

// Read instructions from weather_route_hour.txt with fs.readFile
const getWeatherHourRouteInstructions = readFile(
    path.join(__dirname, '../data/instructions/weather_route_hour.txt'), 
    'utf8', 
    (err, data) => {
    if (err) throw err
    // Console logging data for testing purposes.
    console.log("Debug: \n" + data.toString()) 
})

// Read instructions from weather_route_hours.txt with fs.readFile
const getWeatherHoursRouteInstructions = readFile(
    path.join(__dirname, '../data/instructions/weather_route_hours.txt'), 
    'utf8', 
    (err, data) => {
    if (err) throw err
    // Console logging data for testing purposes.
    console.log("Debug: \n" + data.toString()) 
})


 module.exports = {
     getMainRouteInstructions,
     getWeatherHourRouteInstructions,
     getWeatherHoursRouteInstructions
 }