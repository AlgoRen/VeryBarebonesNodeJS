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
    console.log("Inside getCityWeather: \n" + req.url.split('/')[3])
    try {
        const cityWeatherData = await weatherData.findCity(city_name = 'apopka')

        res.writeHead(200, { 'Content-Type': 'application/json'})
        res.end(JSON.stringify(cityWeatherData))
    } catch (error) {
        console.log(error)
    }
}

// @desc    Gets Hour Weather Data
// @route   GET /weather/hour
async function getHourWeather(req, res) {

}


async function evaluateWeatherURL(req, res) {
    try {
        //  Determine if the url sent is in valid form for the requested route.
        //  If the url is in valid form but no data exists send a JSON response
        //  saying sorry we have no data for that city or time frame.
        //  If the url sent is in a invalid form call getInstructions.
        //  Else return there was a technical error.
        const cityURL = new UrlPattern('/weather/city(/:anything)')
        const cityTrailingURL = new UrlPattern('/weather/city(/:anything/)')
        const allURL = new UrlPattern('/weather/all')
        const allTrailingURL = new UrlPattern('/weather/all/')

        console.log("Inside evaluateWeatherURL: \n" + req.url)


        if (cityURL.match(req.url) || cityTrailingURL.match(req.url)) {
            //  Get weather data for a specific city: getCityWeather()
            console.log("Matched for cityURL!")
            getCityWeather(req, res)
        } 

        if (allURL.match(req.url) || allTrailingURL.match(req.url)) {
            console.log("Matched for allURL!")
            getAllWeather(req, res)
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