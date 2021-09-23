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
        console.log(cityObjects.toString())

        resolve(cityObjects)
    })
}

module.exports = {
    findAll,
    findCity
}