const weatherData = require('../../model/weatherModel')
const errorHandler = require('../error')
const {getInstructions} = require('../index')

async function isHourSearchSuccessful(req, res) {
    //  Executes a chain of promises starting with timeQueryLocated to make a call to 
    //  findHour() within weatherModel. Before findHour() can be called to search for
    //  the data a series of checks and formatting occurs to insure that the correct
    //  data is returned or that if no data is found it is because no data for that 
    //  hour exists, in comparison that no data was found because of route misuse.
    try {
        const hourFound = new Promise((resolve, reject) => timeQueryLocated(resolve, reject, req, res))

        if (hourFound) {
            return hourFound
        } else {
            //  hourFound contains returned value of false meaning that no hours were 
            //  found due to one of the following validation checks finding an error.
            //  NOTE: If the response was not ended by this point an error that should
            //  have been handled by the errorHandler, but was not, occured. 
            console.log(`isHourSearchSuccessful completed all checks but during one of
            the checks an error was found. Error was handled by errorHandler along with
            the ending of the response.`, hourFound)
        }
    } catch (error) {
        //  Unable to create new Promise object for timeQueryLocated()
        console.log("Does not return error/rejection back to controller:", error)
    }
}

async function timeQueryLocated(resolve, reject, req, res) {
    try {
        const url_object = new URL(req.url, `http://${req.headers.host}`)
        const URLPath = url_object.pathname
        console.log(URLPath)

        //  Check for time param existence, returns a boolean.
        const time_param_exists = url_object.searchParams.has('time')
        console.log(time_param_exists)

        if (time_param_exists) {
            //  Get time value after its existence has been proven.
            const timeValue = url_object.searchParams.get('time')
            //  Check to see if time value is not an empty string.
            if (timeValue !== "") {
                //  Call function to validate the value of hour and continue hour data
                //  retrieval. Promise resolves with returned data.
                const hourData = await validateAndRetrieve(
                resolve, reject, req, res, timeValue
                )
                //  The promise is finally fulfilled after running through all checks.
                resolve(hourData) 
            } else {
                //  Sends out an error message detailing error that value is missing.
                errorHandler.sendOutErrors(req, res, error = "noTimeParamValueFound")
                resolve(false)
            }
        } else {
            //  .searchParams.has('time') returned false so checking if user passed in
            //  either incorrect parameters or no parameters at all.
            checkForNoHourParams(req, res, error = "noTimeParamFound", url_object)
            resolve(time_param_exists)
        }
    } catch (error) {
        console.log("Something went wrong in timeQueryLocated execution\n", error)
        errorHandler.sendOutError(req, res, error)
    }
}

async function validateAndRetrieve(resolve, reject, req, res, time) {
    //  TODO: Create better comments for this function.
    try {
        console.log("Typeof:", typeof(time))
        console.log("ParseInt:", parseInt(time))
        const time_int = parseInt(time)
        const time_is_int = !isNaN(time_int) // Time is a number, true or false.

        if (time_is_int) {
            console.log("Is an int")
            const validHourData = await validateHourInt(resolve, reject, res, time_int)
            resolve(validHourData)
        } else {
            console.log("Is not an int")
            errorHandler.sendOutErrors(req, res, error = "timeValueMustBeAnIntValue")
            resolve(time_is_int)
        }
    } catch (error) {
        console.log("Something went in validateAndRetrieve execution\n", error)
        errorHandler.sendOutErrors(req, res, error)
    }
}

async function validateHourInt(resolve, reject, res, intergerFromParam) {
    try {
        let intergerInRange = false  // set to false by default until assigned to true.
        //  Goes through int values 0 to 23 and assigns value true to intergerInRange
        //  if condition is met, breaks, and continues to retrieving data.
        for (let index = 0; index < 24; index++) {
            if (intergerFromParam === index) {
                intergerInRange = true
                break
            }
        }
        //  Set resolved data returned from await call to hoursData and resolves if
        //  intergerInRange is found true or calls a resolve of false if condition 
        //  was not changed to true within the previous for loop. This allows the
        //  isHourSearchSuccessful to be settled as successful (meaning all validation
        //  checks were completed successfully).
        if (intergerInRange) {
            const hourData = await hourDataRetrieved(intergerFromParam)
            console.log("hourData in validateHourInt", hourData)
            resolve(hourData)
        } else {
            //  To determine if the call to validate the hour is between 0-23 or 
            //  if it is out of range
            console.log("Hour data is not valid")
            //  An errorHandler call with the following error message to end response.
            errorHandler.sendOutErrors(req = null, res, error = "timeValueOutsideOfRange")
            //  Resolves isHourSearchSuccessfully with a condition of false, meaning 
            //  that all validation checks were successful but no hours were found.
            //  Meaning that hoursFound will
            resolve(false)
        }
    } catch (error) {
        console.log("Something went wrong in ValidateHourInt execution \n", error)
        // return error
    }
}

async function hourDataRetrieved(time_hour) {
    try {
        // Waits to recieve a fulfilled promise from findHour() then returns data.
        return await weatherData.findHour(time_hour)        
    } catch (error) {
        console.log("Something went wrong in hourDataRetrieved execution \n", error)
        //  Returns error if findHour() code fails to execute.
        // return error
    }
}

async function checkForNoHourParams(req, res, error, url) {
    try {
        console.log("Inside checkForNoHourParams: ", error)
        //  An if statement to validate that this is the correct error message 
        //  being sent to getInstructions.
        if (
            url.search === "" &&
            url.pathname === "/weather/hour" || 
            url.pathname === "/weather/hour/" 
            ) {
            console.log("Being sent to getInstructions from checkForNoHourParams: ", 
            error)
            getInstructions(req, res, error = `Must follow hour with a ?time parameter 
            followed by a time value.`)
        } else {
            // Incorrect parameters or values were sent causing time_name_exists to 
            // return false and the check for the root /hour url to fail resulting in a
            // call to the errorHandler to end the response.
            errorHandler.sendOutErrors(req, res, error)
        }
    } catch (error) {
        // return error
        console.log("Something went wrong in checkForNoHourParams execution \n", error)
    }
}


module.exports = {
    isHourSearchSuccessful
}