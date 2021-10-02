//  Controller for handling the use of routes that provide instructions, 
//  error handling, and other misc. uses.

const errorHandler = require('./error')
const {
    getWeatherHourRouteInstructions, 
    getWeatherHoursRouteInstructions, 
    getMainRouteInstructions
} = require('../model/index')

const mainRouteInstructionsJSON = require('../data/instructions/forJSONSending/main_route.json')
const hourRouteInstructionsJSON = require('../data/instructions/forJSONSending/weather_route_hour.json')


async function homeRouteInstructions(req, res) {
    try {
        mainRouteInstructions = await getMainRouteInstructions()
        res.writeHead(200, {"Content-Type": "text/html"})
        res.end(mainRouteInstructions)

    } catch (error) {
        errorHandler.sendOutErrors(req, res, error)
    }
}


async function weatherHourInstructions(res) {
    try {
        weatherHourInstructions = await getWeatherHourRouteInstructions()
        res.writeHead(200, {"Content-Type": "text/html"})
        res.end(mainRouteInstructions)

    } catch (error) {
        errorHandler.sendOutErrors(req, res, error)
    }
}


async function weatherHoursInstructions(res) {
    try {
        weatherHoursInstructions = await getWeatherHoursRouteInstructions()
        res.writeHead(200, {"Content-Type": "text/html"})
        res.end(mainRouteInstructions)

    } catch (error) {
        errorHandler.sendOutErrors(req, res, error)
    }
}


async function errorRouteInstructions(req, res, error, routeInstructions) {
    console.log(error)
    try {
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify([
            {"error": error}, 
            {routeInstructions}
        ]))
    } catch (error) {
        errorHandler.sendOutErrors(req, res, error)
    }
}


//  Uses an async Await function to get instructions based on the passed in req
//  parameter to call the appropriate method on readInstructions module.

//  @desc   Get instructions on how to use api
//  @route  '/' or any route not defined as a valid route
async function getInstructions(req, res, error, pathname) {
    console.log("Inside getInstructions(): ", error)


    try {
        //  FUNCTION CHANGE
        //  Change function into a function that is called when parameters within
        //  a route are incorrect, call getInstructions with the pathname passed in,
        //  the error being sent to call the appropriate instructions that will be 
        //  return the await call so that routes controller can handle the response.
        switch (error) {
            case "Must follow city/ with a city name.":
                console.log("Inside switch case getInstructions(): ", error)
                instructionsToUse = mainRouteInstructionsJSON
                errorRouteInstructions(req, res, error, instructionsToUse)
                break;
            case `Must follow hour with a ?time parameter 
            followed by a time value.`:
                console.log("Inside switch case getInstructions(): ", error)
                instructionsToUse = hourRouteInstructionsJSON
                errorRouteInstructions(req, res, error, instructionsToUse)
                break;
            default:
                console.log("This happened.")
                break;
        }

    } catch (error) {
        //  Error message
        console.log(error)
        errorHandler.sendOutErrors(req, res, error)
    }
}


module.exports = {
    getInstructions,
    homeRouteInstructions,
    weatherHourInstructions,
    weatherHoursInstructions
}