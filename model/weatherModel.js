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
    //  empty array if no data is found.
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

function findHours(to, from) {
    //  Returns a new promise, rejects only if code fails to execute. Will return an
    //  empty array if no data is found.
    console.log("In findHours: ", to)
    console.log("In findHours: ", from)
    return new Promise((resolve, reject) => {

        //  Loop through hours between the start_hour and end_hour
        //  Add onto hoursObjects with filter method if time.from and time.to match
        //  the hour that is being iterated through.

        //  The starting hour will return the value of "time.to" to prevent the instance
        //  that a weather object's time may be 20:50 to 21:50 if we only select based on
        //  the time.from for the value of 20 we neglect 50 mins of weather data. Instead
        //  we are using the approach to return the weather object that has the time value
        //  leading up to our desired start hour.

        let hoursObjects = []
        let start_hour = to
        let end_hour = from

        //  Create a condition that checks if end_hour is less than start hour. 
        //  For the reason/ condition if someone wants a time window from 10pm (hour 22)
        //  to 2am (hour 2) simply incrementing through from start_hour to the end_hour 
        //  will not work.

        //  Checks for the null value of end_hour is true it will set a default of 23.
        if (end_hour === null) {
            end_hour = 23
        }

        if (start_hour === null) {
            console.log("Must have a start_hour value")
            resolve(false)
        }

        if (start_hour < end_hour) {

            for (let index = start_hour; index <= end_hour; index++) {
                console.log("Repition", index)
                //  Using the 'time.to' value for the user's inputted 'from' value...
                //  (shifted up one hour) is balanced with;
                //  our need to get the hour leading up to the start_hour... 
                //  (shifted down one hour).
                let hourToSearch = index
                const hourToAdd = weatherData.filter(
                    object => object.time.to.split(':')[0] == hourToSearch)
                
                if (hourToAdd.length > 0) {
                    hoursObjects.push(hourToAdd)
                } 
            }
        } else {
            console.log("Got to do a different method to get hours.")
        }
        console.log("Hours array:", hoursObjects)
        resolve(hoursObjects)
    })
}
//  Testing call
// findHours()

module.exports = {
    findAll,
    findCity,
    findHour,
    findHours
}