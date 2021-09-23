const UrlPattern = require('url-pattern')

const { getMainRouteInstructions } = require('../model')
const weatherData = require('../model/weatherModel') // Weather model

// @desc    Gets All Weather Data
// @route   GET /weather/all
async function getAllWeather(req, res) {
    try {
        const allWeatherData = await weatherData.findAll()

        res.writeHead(200, { 'Content-Type': 'application/json'})
        res.end(JSON.stringify(allWeatherData))
    } catch (error) {
        console.log(error)
    }
}

// @desc    Gets City Weather Data
// @route   GET /weather/city
async function getCityWeather(req, res) {
    let city_name = ''
    console.log("Inside getCityWeather: \n" + req.url.split('/')[3])
    //  Checks that a city name exists.

    //  Gets city name from URL.
    city_name = req.url.split('/')[3].toLowerCase().trim()

    try {
        const cityWeatherData = await weatherData.findCity(city_name)
        //  Sends data to user
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(cityWeatherData))
    }
    catch (error) {
        console.log(error.message)
    }
}

// @desc    Gets Hour Weather Data
// @route   GET /weather/hour
async function getHourWeather(req, res) {
    try {
        const hourWeatherData = await weatherData.findHour()

        res.writeHead(200, { 'Content-Type': 'application/json'})
        res.end(JSON.stringify(hourWeatherData))
    } catch (error) {
        console.log(error)
    }
}


async function evaluateWeatherURL(req, res) {
    try {
        //  Determine if the url sent is in valid form for the requested route.
        //  If the url is in valid form but no data exists send a JSON response
        //  saying sorry we have no data for that city or time frame.
        //  If the url sent is in a invalid form call getInstructions.
        //  Else return there was a technical error.
        const hourURL = new UrlPattern('/weather/hour')
        const cityURL = new UrlPattern('/weather/city(/:anything)')
        const cityWithNoNameURL = new UrlPattern('/weather/city')
        const allURL = new UrlPattern('/weather/all')

        console.log("Inside evaluateWeatherURL: \n" + req.url)
        console.log("Inside evaluateWeatherURL: \n" + req.url.toString().length)
        let urlString = req.url.toString().trim()
        //  Removes last forward slash if it is the last character of the url string
        if (urlString.lastIndexOf('/') == urlString.length - 1) {
            urlString = urlString.slice(0, urlString.length - 1)
        }

        //  Matching urlString to appropriate 'get' function
        if (hourURL.match(urlString)) {
            console.log("Matched for hourURL!")
            getHourWeather(req, res)
        }

        if (cityURL.match(urlString)) {
            //  Get weather data for a specific city: getCityWeather()
            console.log("Matched for cityURL!")
            getCityWeather(req, res)
        } 

        if (allURL.match(urlString)) {
            console.log("Matched for allURL!")
            getAllWeather(req, res)
        }

        if (cityWithNoNameURL.match(urlString)) {
            //  Sends 400 error code and JSON object with error message.
            //  To Do: Create an errors.json document that holds error messages
            //  like this in JSON format.
            const noCityNameErrorMessage =
                "Error most likely due to no city following '/city/'. Please try again with a city name."
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ "message": noCityNameErrorMessage }))
        }

        getMainRouteInstructions(req, res)


            //  Get all weather data for a specific hour: getHourWeather()
            //  Call weather format error that says the error is due to bad
            //  formatting and tells user to call home route to see the
            //  instructions: badFormatError()
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    evaluateWeatherURL
}