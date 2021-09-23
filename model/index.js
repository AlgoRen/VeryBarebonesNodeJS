//  Model for returning data from the data folder that has to deal with 
//  instructions, error handling, and other misc. uses.

//  Imports
const { readFileSync } = require('fs')
const path = require('path')

//  Routes
const pathToMainRoute = '../data/instructions/main_route.txt'
const pathToWeatherHourRoute = '../data/instructions/weather_route_hour.txt'
const pathToWeatherHoursRoute = '../data/instructions/weather_route_hours.txt'

//  Read instructions from passed in route with fs.readFile
function readData(route) { 
    let instructions = readFileSync(path.join(__dirname, route), 'utf8')
    console.log("readData scope index.js: \n" + instructions)
    return instructions
}

//  Get instructions by passing in the route to main_route.txt into the
//  readData function, resolves getMainRouteInstructions with the text data.
function getMainRouteInstructions() {
    return new Promise((resolve, reject) => {
        let mainRouteInstructions = readData(route = pathToMainRoute)
        console.log("getmainRouteInstructions scope: \n" + mainRouteInstructions)
        resolve(mainRouteInstructions)
        reject('Something went wrong for getMainRouteInstructions.')
    })
}

//  Get instructions by passing in the route to weather_route_hour.txt into the
//  readData function, resolves getMainRouteInstructions with the text data.
function getWeatherHourRouteInstructions() {
    return new Promise((resolve, reject) => {
        let weatherHourInstructions = readData(route = pathToWeatherHourRoute)
        console.log("getmainRouteInstructions scope: \n" + weatherHourInstructions)
        resolve(weatherHourInstructions)
        reject('Something went wrong for getWeatherHourRouteInstructions.')
    })
}

//  Get instructions by passing in the route to weather_route_hours.txt into the
//  readData function, resolves getWeatherHoursRouteInstructions with the text data.
function getWeatherHoursRouteInstructions() {
    return new Promise((resolve, reject) => {
        let weatherHoursInstructions = readData(route = pathToWeatherHoursRoute)
        console.log("getWeatherHoursInstructions scope: \n" + weatherHoursInstructions)
        resolve(weatherHoursInstructions)
        reject('Something went wrong for getWeatherHoursRouteInstructions.')
    })
}


 module.exports = {
     getMainRouteInstructions,
     getWeatherHourRouteInstructions,
     getWeatherHoursRouteInstructions
 }