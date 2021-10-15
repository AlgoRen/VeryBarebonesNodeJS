const weatherData = require('../../model/weatherModel')
const errorHandler = require('../error')
const {getInstructions} = require('../index')

//  Global scope const
const hours = {"from": null, "to": null}

async function isHourSearchSuccessful(req, res) {
    try {
        //  Execute a series of promises starting with timeQueryExists that make a call 
        //  to locateTimeQuery. Additional promises are called to validate parameter 
        //  data. A final Promise, hourDataRetrieved, is called to interact with 
        //  weatherModel.js and retrieve the data based on our query. The following
        //  isHourSearchSuccessful function is engineered to insure that the correct
        //  data is returned to weatherController.js or in the case no data is found 
        //  we can ensure it is because no data for that hour exists, in comparison to 
        //  no data was found because of route misuse or code execution errors.



        //  A Promise resolving function locates the search parameter "time" within a 
        //  URL and checks the time param value for an empty string.
        //  Return a boolean.
        const timeQueryExists = new Promise((resolve, reject) => locateTimeQuery(
            resolve, reject, req, res))
        //  A Promise resolving function checks if the following search parameter is an
        //  integer upon conversion from URL string to int. 
        //  Return a boolean.
        const paramIsInt = new Promise((resolve, reject) => checkParamIsInt(
            resolve, reject, req, res, multiple_checks = false))
        //  A Promise resolving function for validating interger is between 0 and 23.
        //  Return a boolean.
        const intIsInRange = new Promise((resolve, reject) => checkIntIsInRange(
            resolve, reject, req, res, multiple_checks = false))

        //  Awaits for all Promises to fulfill and checks to see if any promises
        //  returned (via resolve) a false value. If all Promises return true, then
        //  hourData will await a resolved response with data returned from the weather
        //  database.
        //  A rejection should only occur in the instance of code failing to execute.
        const paramIsValid = await Promise.all([
            timeQueryExists, paramIsInt, intIsInRange
        ]).then(results => {
            console.log("Successful results for searchResults:")
            console.log("timeQueryExists is ", results[0])
            console.log("paramIsInt is ", results[1])
            console.log("intIsInRange is ", results[2])

            if (results[0] !== false || results[1] !== false || results[3] !== false) {
                console.log("The results of ParamIsValid: \n", results)
                console.log("Should return true.")
                return true
            }
            // TODO: Call to error handler depending on error message.
            console.log("The results of ParamIsValid: \n", results)
            console.log(`Should return false. One of the following promises returned 
            a value of false, indicating a form of wrong formatting was found`)
            return false
        }).catch(error => {
            //  A runtime error occurred during paramIsValid execution and was unable
            //  to continue to its completion.
            //  Calls error handler and returns false.
            console.log(error)
            console.log(`A rejection was returned because of an error within a 
            try-catch block in one of the following promises.`)
            // errorHandler.internalDiagnostics()
            errorHandler.sendOutErrors(req, res, error = "runtimeError")
            return false
        })


        //  Checks paramIsValid for a value of true before continuing to call 
        //  hourDataRetrieved() asynchoronously.
        let hourData = null //  Remains null unless updated by if statement.
        //  Check that Promise.all resolved successfully
        if (paramIsValid === true) {
            //  Hour data is retrieved by accessing the global scope variable hours
            //  and passing in hour.from to findHour function in weatherModel.js
            console.log("The param validation was successful.")
            hourData = await hourDataRetrieved()
            //  Return data that constant hourWeatherData within weatherController.js
            //  will receive to conclude the await call to isHourSearchSuccessful.
            return hourData
        }
    } catch (error) {
            console.log("An error occured in isHourSearchSuccessful", error)
    }
    //  End of isHourSearchSuccessful()
}


//  Check for the time parameter's existence, and that value is not an empty string.
//  Successfully resolve with true on success. Resolve with false if failed to locate 
//  time parameter or if the value is an empty string. Reject only if an error occurs
//  in the try-catch's execution.
async function locateTimeQuery(resolve, reject, req, res) {
    try {
        //  Create a new URL object to run searchParams methods on.
        const url_object = new URL(req.url, `http://${req.headers.host}`)
        //  Check for time param existence, returns a boolean.
        const time_param_exists = url_object.searchParams.has('time')
        console.log(time_param_exists)

        if (time_param_exists) {
            //  Get time value after its existence has been proven.
            const timeValue = url_object.searchParams.get('time')
            //  Check to see if time value is not an empty string.
            if (timeValue !== "") {
                //  Update the global hour object with valid time value.
                hours.from = url_object.searchParams.get('time')
                //  Get time value after proving its existence, and that string is 
                //  not empty. I could have just returned the value, but I prefer to 
                //  only return booleans with these current promises to make the 
                //  Promise.all check that happens later a bit easier to manage.
                console.log("Update hours object with value from .get('time'):", hours)
                //  Return true
                resolve(time_param_exists) // Contains a value of true.
            } else {
                //  Sends out an error message detailing error that value is missing.
                errorHandler.sendOutErrors(req, res, error = "noTimeParamValueFound")
                //  Return false because the time parameter was an empty string.
                resolve(false)
            }
        } else {
            //  .searchParams.has('time') returned false so checking if user passed in
            //  either incorrect parameters or no parameters at all.
            checkForNoHourParams(req, res, error = "noTimeParamFound", url_object)
            //  Return false because either the time parameter failed to be located.
            resolve(time_param_exists) // Contains a value of false.
        }
    } catch (error) {
        console.log("An error occured in locateToQuery execution\n", error)
        error = {
            error: error,
            location: "locateToQuery", 
            msg: "An error occured in locateToQuery execution"
        }
        reject(error)
    }
    //  End of locateTimeQuery()
}


//  Check if a parameter is an integer. Decides which parameters to check by knowing if
//  the hour.js or hours.js file called the function, identified by the value of 
//  multiple_checks argument. If checkParamIsInt calls with a multiple_checks argument
//  containing a truthy value, an instance of hours object from hours.js; the function
//  will have side effects, such as updating hours.from and hours.to with the hours
//  object from hours.js and return values isntead of resolving. 
async function checkParamIsInt(resolve, reject, req, res, multiple_checks) {
    try {
        console.log("Inside checkParamIsInt", hours)
        //  Update hours data with hours data from hours.js
        if (multiple_checks) {
            hours.from = multiple_checks.from
            hours.to = multiple_checks.to
        } 


        //  Parse from value, either a string containing a number, if used correctly,
        //  to int or a string of characters to NaN value. The from value should not be
        //  null. If so, locateTimeQuery failed to update the global hours object.
        const from_int = parseInt(hours.from) 
        //  Constant from_int is a number by checking that it is NOT not a number(NaN).
        //  Returns true or false. 
        const from_is_int = !isNaN(from_int)

        //  Check for a true value with an if statement and resolve Promise with true
        //  if it is a single param check or only update hours.from if otherwise. If 
        //  false, send out error via errorHandler and resolve false if it is a single
        //  param check or return error with a message if it is multple param check.
        if (from_is_int) {
            console.log("Is an int")
            //  Will either resolve or continue on to check 'to' parameter if 
            //  multuple_checks condition is met.
            if (!multiple_checks) {
                //  Update global hour object with the int value of from and 
                //  resolve true if call originates from hour.js.
                hours.from = from_int
                resolve(from_is_int)
            }
            //  Update hours.from with new int value to be returned to the caller
            //  function, in this case, checkParamsAreInt, in hours.js.
            hours.from = from_int
        } else {
            console.log("Is not an int")
            //  Decide which error to send to errorHandler for either time query or 
            //  from query depending on if hour.js or hours.js calls this function.
            if (!multiple_checks) {
                errorHandler.sendOutErrors(req, res, error = "timeValueMustBeAnIntValue")
                //  Resolve false if call originates from hour.js.
                resolve(from_is_int)
            } else {
                //  Return error with the following message to hours.js.
                return error = "fromValueMustBeAnIntValue"
            }
        }

        //  Check if to value is an int if multiple_checks equals a value that is truth
        //  like. The argument multiple_checks should contain an hours object if 
        //  hours.js called this function to check both params.
        if (multiple_checks) {
            const to_int = parseInt(hours.to) 
            //  Constant to_int is a number by checking that it is NOT not a number
            // (NaN).
            //  Returns true or false. 
            const to_is_int = !isNaN(to_int) 

            //  Check for a true value with an if statement and resolve Promise with true
            //  if it is a single param check or only update hours.from if otherwise. If 
            //  false, send out error via errorHandler and resolve false if it is a single
            //  param check or return error with a message if it is multple param check.
            if (to_is_int) {
                console.log("Is an int")
                //  Updates hours.to with new int value to be returned to the caller
                //  function, in this case, checkParamsAreInt.
                hours.to = to_int
            } else {
                console.log("Is not an int")
                //  Returns error with the following message to hours.js.
                return error = "toValueMustBeAnIntValue"
            }
        }

        // Return hours object to checkParamsAreInt function within hours.js.
        if (multiple_checks) {
            return hours
        }
    } catch (error) {
        console.log("An error occured in checkParamIsInt execution\n", error)
        return error = {
            error: error,
            location: "checkParamIsInt",
            msg: "An error occured in checkParamIsInt execution."
        }
    }
    //  End of checkParamIsInt()
}


//  Check if an hours property is between 0 and 23.
async function checkIntIsInRange(resolve, reject, req, res, multiple_checks) {
    try {
        console.log("Inside checkIntIsRange", hours)
        //  The valueInRange is set to false until a met condition sets it to true.
        
        //  If checkIntIsInRange calls with multiple_checks set to false, the following
        //  two things happen: First, integerInRange will call with arguments that only
        //  need to check the from parameter. Second, it will either resolve with a
        //  true or false value depending on the boolean value of valueInRange once
        //  integerInRange has completed. 
        
        //  If checkIntIsInRange calls with multiple_checks set to true, then 
        //  integerInRange will return with the value of errorKey. The value of 
        //  errorKey will contain either the current key (from or to) or a null value
        //  if the integer is in range. The checkIntIsInRange call will return with
        //  the value of integerInRange.

        let valueInRange = false  // Initialized with false.

        //  Function that checks interger is between 0 and 23.
        const integerInRange = (element, key) => {
            //  Assume current key of hours object is invalid (not in range) until
            //  for loop assigns and return errorKey as null.
            let errorKey = key
            console.log("Current key:", errorKey)

            for (let index = 0; index < 24; index++) {
                if (element === index) {
                    //  Set valuesInRange to true; this will remain unless the next
                    //  hours property is not in range.
                    valueInRange = true
                    //  Return errorKey as null as an item in keysOutOfRange array.
                    return errorKey = null
                } else {
                    //  Set valuesInRange to false; this will remain unless the next
                    //  hours property is in range.
                    valueInRange = false
                }
            }
            //  Return currently iterated key as an item for keysOutOfRange array.
            return errorKey
            //  End of integerInRange()
        }
        //  Resolve to intIsInRange Promise.
        if (!multiple_checks) {
            integerInRange(element = hours.from, key = "from")

            console.log("Updated valueInRange: ", valueInRange)
            //  After from key in hours object is checked to be in range, valueInRange 
            //  will determine if the current Promise resolves true or false.
            if (valueInRange) {
                resolve(true)
            } else {
                errorHandler.sendOutErrors(req, res, error = "timeValueOutsideOfRange")
                resolve(false)
            }
        }
        //  Return to hours.js --> checkParamsAreInRange() --> results
        if (multiple_checks) {
            return integerInRange
        }
    } catch (error) {
        console.log("An error occured in checkIntIsInRange execution \n", error)
        return error = {
            error: error,
            location: "checkIntIsInRange", 
            msg: "An occured in checIntIsInRange execution"
        }
    }
    //  End of checkIntIsInRange()
}

async function hourDataRetrieved(hour = hours.from) {
    try {
        // Waits to recieve a fulfilled Promise from findHour() then returns data.
        return await weatherData.findHour(hour)        
    } catch (error) {
        console.log("An error occured in hourDataRetrieved execution \n", error)
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
            // call to the errorHandler to end the response. The following is a saftey
            //  check unlikely to happen.
            errorHandler.sendOutErrors(req, res, error)
        }
    } catch (error) {
        console.log("An error occured in checkForNoHourParams execution \n", error)
    }
}


module.exports = {
    isHourSearchSuccessful,
    checkParamIsInt,
    checkIntIsInRange
}