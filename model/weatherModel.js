const weatherData = require('../data/weather.json') // Weather data from weather.json object.

function findAll() {
    return new Promise((resolve, reject) => {
        resolve(weatherData)
        // reject('Something went wrong.') ?
    })
}

module.exports = {
    findAll
}