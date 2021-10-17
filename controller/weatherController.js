const UrlPattern = require('url-pattern')

const errorHandler = require('./error')
const {
    getInstructions, 
    homeRouteInstructions,
    weatherHourInstructions,
    weatherHoursInstructions
} = require('./index')
const {isCitySearchSuccessful} = require('./validation/city')
const {isHourSearchSuccessful} = require('./validation/hour')
const {isHoursSearchSuccessful} = require('./validation/hours')
const weatherData = require('../model/weatherModel') // Weather model

// @desc    Gets All Weather Data
// @route   GET /weather/all
async function getAllWeather(req, res) {
    try {
        const allWeatherData = await weatherData.findAll()

        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify(allWeatherData))
    } catch (error) {
        console.log(error)
    }
}

// @desc    Gets City Weather Data
// @route   GET /weather/city
async function getCityWeather(req, res) {
    try {
        //  Validation check for name and that data exits.
        const cityWeatherData = await isCitySearchSuccessful(req, res)
        //  Please note that data being returned by this Promise should only do so
        //  if validation was successful. Any errors should not be returned. A call
        //  to errorHandler should of been made in one of the validation checks. If
        //  this try-catch results in a rejection it should be because the await call 
        //  was unable to be made, if that happens then the code in catch will execute.

        console.log("Returned cityWeatherData: ")
        console.log(cityWeatherData)
        if (cityWeatherData) {
            if(cityWeatherData.length > 0) {
                //  Sends data to user
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify({"message": cityWeatherData}))
            } else {
                errorHandler.sendOutErrors(req, res, error = "noCityDataFound")
            }
        } 
    } catch (error) {
        // errorHandler.sendOutErrors(res, req, error)
        console.log(error)
    }
}

// @desc    Gets Hour Weather Data
// @route   GET /weather/hour
async function getHourWeather(req, res) {
    try {
        //  Validation check for time parameter, correct hour values, and data.
        const hourWeatherData = await isHourSearchSuccessful(req, res)
        console.log("Returned hourWeatherData: ")
        console.log(hourWeatherData)
        if (hourWeatherData) {
            if (hourWeatherData.length > 0) {
                //  Sends data to user
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify({"message": hourWeatherData}))
            } else {
                errorHandler.sendOutErrors(req, res, error = "noHourDataFound")
            }
        } 
    } catch (error) {
        console.log(error)
    }
}

// @desc    Gets Hours Weather Data
// @route   GET /weather/hours
async function getHoursWeather(req, res) {
    try {
        //  Validation check for from & to parameters, correct hour values, and data.
        console.log("Inside hoursWeatherData.")
        const hoursWeatherData = await isHoursSearchSuccessful(req, res)
        console.log("Returned hoursWeatherData: ")
        console.log(hoursWeatherData)
        // if (hoursWeatherData) {
        //     if (hoursWeatherData.length > 0) {
        //         //  Send data to user
        //         res.writeHead(200, {"Content-Type": "application/json"})
        //         res.end(JSON.stringify({"message": hoursWeatherData}))
        //     } else {
        //         errorHandler.sendOutErrors(req, res, error = "noHoursDataFound")
        //     }
        // }
    } catch (error) {
        console.log(error)
    }
}


//  Determine if the url sent is in valid form for the requested route.
async function evaluateWeatherURL(req, res) {
    //  Start of  evaluateWeatherURL try condition
    try {
        const cityURL = new UrlPattern('/weather/city(/:anything)')
        const allURL = new UrlPattern('/weather/all')
        const rootCityURL = new UrlPattern('/weather/city')
        const rootHourURL = new UrlPattern('/weather/hour')
        const rootHoursURL = new UrlPattern('/weather/hours')
        const rootWeatherURL = new UrlPattern('/weather')


        console.log("Inside evaluateWeatherURL: \n" + req.url)

        //  Makes a new URL object so urls can be checked in order to call the right 
        // get[route]Weather.
        const routeURL = new URL(req.url, `http://${req.headers.host}`)
        const URLPath = routeURL.pathname
        const URLSearch = routeURL.search

        //  Cleans up urls to match for root[route]URL checks and getAllWeather.
        let urlString = req.url.toString().trim()
        if (urlString.lastIndexOf('/') == urlString.length - 1) {
            urlString = urlString.slice(0, urlString.length - 1)
        }

        //  Matching urlString to appropriate 'get' function
        if (URLSearch !== '' && rootHoursURL.match(URLPath)) {
            //  Get all weather data for a specific hour: getHourWeather()
            console.log("Matched for hours")

            try {
                console.log("hours: Is it getting to this try-catch?")
                getHoursWeather(req, res)
            } catch (error) {
                console.log(error)
                errorHandler.sendOutErrors(req, res, error)
            }
        }
        //  Matching urlString to appropriate 'get' function
        else if (URLSearch !== '' && rootHourURL.match(URLPath)) {
            //  Get all weather data for a specific hour: getHourWeather()
            console.log("Matched for hour")

            try {
                console.log("hour: Is it getting to this try-catch?")
                getHourWeather(req, res)
            } catch (error) {
                console.log(error)
                errorHandler.sendOutErrors(req, res, error)
            }
        }
        else if (URLSearch === '' && cityURL.match(urlString)) {
            //  Get weather data for a specific city: getCityWeather()

            try {
                console.log("cityURL match: Is it getting to this try-catch?")
                getCityWeather(req, res)
            } catch (error) {
                console.log(error)
                errorHandler.sendOutErrors(req, res, error)
            }
        } 
        else if (allURL.match(urlString)) {
            console.log("Matched for allURL")

            try {
                console.log("allURL match: Is it getting to this try-catch?")
                getAllWeather(req, res)
            } catch (error) {
                console.log(error)
                errorHandler.sendOutErrors(req, res, error)
            }
        }
        //  Matching root URLs to call specific instructions for routes:
        else if (rootHourURL.match(urlString)) {
            console.log("Matched for rootHourURL")
            weatherHourInstructions(req, res)

        }
        else if (rootHoursURL.match(urlString)) {
            console.log("Matched for rootHoursURL")
            weatherHoursInstructions(req, res)

        }
        else if (rootWeatherURL.match(urlString)) {
            console.log("Matched for rootWeatherURL")
            homeRouteInstructions(req, res)
        } 
        else {
            errorHandler.sendOutErrors(req, res, error = "routeNotFound")
        }
    // End of evaluateWeatherURL try condition
    } catch (error) {
        console.log("Something went wrong in evaluateURL()")
        console.log(error)
    }
//  End of evaluateWeatherURL async function
}

module.exports = {
    evaluateWeatherURL
}