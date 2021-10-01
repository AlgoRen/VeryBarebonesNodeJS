const weatherData = require('../../model/weatherModel')
const errorHandler = require('../error')
const {getInstructions} = require('../index')


//  Handles the calling and returning of the validation check within getCityData()
async function isCitySearchSuccessful(req, res) {
    //  Try-catch will succeed if promise is able to be successfully fulfilled even if
    //  no city data was found, in that case cityParamLocated will return an empty an 
    //  array. If cityParamLocated returns a boolean value of false the response will 
    //  no longer be handled by getCityData() but will either be handled by 
    //  getInstructions() or errorHandler()...
    //  this is decided by checkForNoCityParams function.
    try {
        const cityFound = new Promise((resolve, reject) => cityParamLocated(resolve, reject, req, res))

        cityFound.then((result) => {
            if (result) {
                console.log("This shouldnt be false", result)
                return result
            } else {
                console.log("Send out error with errorHandler", result)
            }
        })
    } catch (error) {
        console.log("Does not return error/rejection back to controller:", error)
    }
}

async function cityParamLocated(resolve, reject, req, res) {
    try {
        const url_object = new URL(req.url, `http://${req.headers.host}`)
        const URLPath = url_object.pathname
        const URLSearch = url_object.search

        const city_name_exists = (URLPath.split('/')).length > 3 ? true : false
        console.log("cityParamLocated - city_name_exists: \n", city_name_exists)

        if (city_name_exists) {
            const city_name = URLPath.split('/')[3]
            console.log("cityParamLocated - city_name: \n", city_name)
            const cityData = await cityDataRetrieved(city_name)
            resolve(cityData)
        } else {
            checkForNoCityParams(req, res, "Failed to locate city name in route.")
            resolve(city_name_exists)
        }
    } catch (error) {
        console.log("Does not return error/rejection back to controller:", error)
    }
}

async function cityDataRetrieved(city_name) {
    try {
        // Waits to recieve a fulfilled promise from findCity()
        return await weatherData.findCity(city_name)        
    } catch (error) {
        //  Returns reason for rejection in findCity() function within weatherModel.js
        return error
    }
}

async function checkForNoCityParams(req, res, error) {
    try {
        console.log("Inside checkForNoCityParams: ", error)
        const urlObj = new URL(req.url, `http://${req.headers.host}`)
        let root = urlObj.pathname

        console.log("Another test:", root)
        //  An if statement to validate if the request to /weather/city was sent with
        //  either no parameters to the correct root or with wrong parameters/values.
        if (root.toString().trim() === "/weather/city" || "/weather/city/") {
            //  If true, this means somehow the initial check, within evaluateURL, for 
            // the root url of city failed passing along the request to getHourWeather 
            //  instead of to getInstructions. A very low chance of this happening. A
            //  call to getInstructions with an error message will be sent.
            console.log("Being sent to getInstructions from checkForNoCityParams: ", error)
            getInstructions(req, res, error = "Must follow city/ with a city name.")
        } else {
            // Incorrect parameters or values were sent causing city_name_exists to 
            // return false and the check for the root /city url to fail resulting in a
            // call to the errorHandler to end the response.
            return "This will be a call to errorHandler"
        }
    } catch (error) {
        console.log("Something went wrong in checkForNoCityParams execution \n", error)
    }
}

module.exports = {
    isCitySearchSuccessful,
    checkForNoCityParams
}

