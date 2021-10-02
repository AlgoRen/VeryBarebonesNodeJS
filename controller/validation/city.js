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
        return cityFound

    } catch (error) {
        console.log("Does not return error/rejection back to controller:", error)
    }
}

async function cityParamLocated(resolve, reject, req, res) {
    try {
        const url_object = new URL(req.url, `http://${req.headers.host}`)
        const URLPath = url_object.pathname

        //  Looks to see if the URL path has a fourth location, where city value is.
        const city_param_exists = (URLPath.split('/')).length > 3 ? true : false
        console.log("cityParamLocated - city_param_exists: \n", city_param_exists)

        //  Check to see if city value is not an empty string.
        if (city_param_exists) {
            //  Gets the value of the fourth location of the created array from split.
            const city_name = URLPath.split('/')[3]
            console.log("cityParamLocated - city_name: \n", city_name)
            //  Checks to see if the fourth location is an empty string.
            if(city_name !== "") {
                //  Call function to validate the value of hour and continue hour data
                //  retrieval. Promise resolves with returned data.
                const cityData = await cityDataRetrieved(city_name)
                //  The promise is finally fulfilled after running through all checks.
                resolve(cityData) 
            } else {
                checkForNoCityParams(req, res, error = "noCityParamValueFound", url_object)
                resolve(false)
            }
        } else {
            //  Decides how to end response with either an errorHandler call or a call
            //  to getInstructions.
            checkForNoCityParams(req, res, error = "noCityParamValueFound", url_object)
            resolve(city_param_exists)
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

async function checkForNoCityParams(req, res, error, url) {
    try {
        console.log("Inside checkForNoCityParams: ", error)
        console.log(url)
        //  An if statement to validate that this is the correct error message 
        //  being sent to getInstructions.
        if (
            url.pathname === "/weather/city" || 
            url.pathname === "/weather/city/" 
            ) {
            console.log("Being sent to getInstructions from checkForNoHourParams: ", 
            error)
            getInstructions(req, res, error = "Must follow city/ with a city name.")
        } else {
            // Incorrect parameters or values were sent causing time_name_exists to 
            // return false and the check for the root /hour url to fail resulting in a
            // call to the errorHandler to end the response.
            errorHandler.sendOutErrors(req, res, error)
        }
    } catch (error) {
        console.log("Something went wrong in checkForNoCityParams execution \n", error)
    }
}

module.exports = {
    isCitySearchSuccessful,
    checkForNoCityParams
}

