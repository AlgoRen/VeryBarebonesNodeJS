const weatherData = require('../data/weather.json') // Weather data from weather.json object.

function findAll() {
    return new Promise((resolve, reject) => {
        resolve(weatherData)
        // reject('Something went wrong.') ?
    })
}

function findCity(city_name) {
    city_name = city_name.toLowerCase()

    return new Promise((resolve, reject) => {
        console.log("Inside findCity, weatherData: \n" + weatherData)
        console.log("Inside findCity, weatherData: \n" + city_name)

        let cityObjects = weatherData.filter(object => object.location.city.name.toLowerCase() == city_name)

        console.log(cityObjects.length)
        if (cityObjects.length == 0) {
            reject("Could not find any weather data for this city.")
        }

        resolve(cityObjects)

    })
}

function findHour() {

    return new Promise((resolve, reject) => {
        let hourObjects = weatherData.filter(object => object.time.from.split(':')[0] == 19)

        console.log(hourObjects)
        console.log(hourObjects.length)

        resolve("Find hour working.")
    })
}

module.exports = {
    findAll,
    findCity,
    findHour
}