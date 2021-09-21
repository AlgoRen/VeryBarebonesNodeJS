const weatherData = require('../model/weatherModel') // Weather model

// @desc    Gets All Weather Data
// @route   GET /weather
async function getAllWeather(req, res) {
    try {
        const allWeatherData = await weatherData.findAll()

        res.writeHead(200, { 'Content-Type': 'application/json'})
        res.end(JSON.stringify(allWeatherData))
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllWeather
}