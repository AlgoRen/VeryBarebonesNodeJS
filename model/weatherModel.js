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

        let cityObjects = weatherData.filter(
            object => object.location.city.name.toLowerCase() == city_name)

        resolve(cityObjects)
    })
}

function findHour(hour) {
    //  Returns a new promise, rejects only if code fails to execute. Will return an 
    //  an empty array if no data is found.
    return new Promise((resolve, reject) => {
        //  Calls filter HOA method on WeatherData array to check each objects'
        //  time.from property hour value to filter out any objects that do not
        //  equal the hour parameter passed in. Returning an array of objects
        //  that have matched the request hour.
        let hourObjects = weatherData.filter(
            object => object.time.from.split(':')[0] == hour)

        console.log(hourObjects)
        console.log(hourObjects.length)
        //  Sends resolve response with the recieved array in hourObjects
        resolve(hourObjects)
    })
}

module.exports = {
    findAll,
    findCity,
    findHour
}