const weatherData = require('../../model/weatherModel')
const errorHandler = require('../error')
const { checkParamIsInt, checkIntIsInRange } = require('./hour')

//  Global scope const
const hours = {"from": null, "to": null}

async function isHoursSearchSuccessful (req, res) {
    try {
        //  A Promise resolving function locates the search parameters to and from 
        //  within a URL and checks the to and from param value for an empty string.
        //  Return a boolean.
        const hoursQueryExists = new Promise((resolve, reject) => locateHoursQuery(
            resolve, reject, req, res))
        //  A Promise resolving function checks if to and from parameters are integers
        //  upon conversion from URL string to int. 
        //  Return a boolean.
        const paramsAreInt = new Promise((resolve, reject) => checkParamsAreInt(
            resolve, reject, req, res))
        //  A Promise resolving function for validating intergers are between 0 and 23.
        //  Return a boolean.
        const paramsAreInRange = new Promise((resolve, reject) => checkParamsAreInRange(
            resolve, reject, req, res))

        //  A Promise All call that handles rejections and continues with all promises 
        //  before settling.
        const paramsAreValid = await Promise.all([
            hoursQueryExists, paramsAreInt, paramsAreInRange
        ]).then(results => {
            //  Call function to get data and return results if both promise are 
            //  successful.
            console.log("hoursQueryExists is ", results[0])
            console.log("paramsAreInt is ", results[1])
            console.log("paramsAreInRange is ", results[3])
            return true
        })
 
        //  Possible put this in another try-catch?
        console.log("A quick console log of paramsAreValid: ", paramsAreValid)
        //  A returned result of true from paramsAreValid will initiate the call to use
        //  url.search params to and from as values for retrieving the weather data
        //  from an await call to searchResults
        if (paramsAreValid === true)  {
            //  TODO: Get to and from search parameters from url.search
            const hoursFound = await searchResults(from = hours.from, to = hours.from)
            console.log("Before resolving isHoursSearchSuccessful: ", hoursFound)
            return hoursFound
        } else {
            console.log("One of these params returned false: ", paramsAreValid)
        }
    } catch (error) {
        //  TODO: Needs commenting.
        console.log("Does not return error/rejection back to controller:", error)
    }
}


//  TODO: Needs commenting
async function locateHoursQuery(resolve, reject, req, res) {
    try {
        const url_object = new URL(req.url, `http://${req.headers.host}`)
        const URLPath = url_object.pathname
        console.log(URLPath)

        //  Check for "from" and "to" params.

        //  Check for from param existence, returns a boolean.
        const from_param_exists = url_object.searchParams.has('from')
        console.log(from_param_exists)

        if (from_param_exists) {
            const fromValue = url_object.searchParams.get('from')
            console.log("From Query:", fromValue)
            //  Check to see if from value is not an empty string.
            if (fromValue !== "") {
                //  Update the global hour object with valid from value.
                hours.from = fromValue
                //  Get time from after proving its existence and that string is 
                //  not empty. I could have just returned the value, but I prefer to 
                //  only return booleans with these current promises to make the 
                //  Promise.all check that happens later a bit easier to manage.
                console.log("Updating hours object with value from .get('from'):", hours.from)
            }

            //  Check for to param existence, returns a boolean. 
            const to_param_exists = url_object.searchParams.has('to')
            console.log(to_param_exists)

            if (to_param_exists) {
                const toValue = url_object.searchParams.get('to')
                console.log("To value:", toValue)
                //  Check to see if to value is not an empty string.
                if (toValue !== "") {
                    //  Update the global hour object with valid to value.
                    hours.to = toValue
                    //  Get time from after proving its existence and that string is 
                    //  not empty. I could have just returned the value, but I prefer to 
                    //  only return booleans with these current promises to make the 
                    //  Promise.all check that happens later a bit easier to manage.
                    console.log("Updating hours object with value from .get('to'): ", hours.to)
                }
            } else {
                //  If there is no to param set a default to value of 23.
                hours.to = 23
                console.log("No to param found. Creating a default param value of 23: ", hours.to)
            }
            console.log("The updated hours object after params search:", hours)
            //  Return true if a non empty string from value was found.
            resolve(from_param_exists)
        } else {
            //  .searchParams.has('from') returned false so checking if user passed in
            //  either incorrect parameters or no parameters at all.
            checkForNoFromParam(req, res, error = "noFromParamFound", url_object)
            //  Return false because the from parameter failed to be located.
            resolve(from_param_exists)
        }
    } catch (error) {
        console.log("An error occured in locateHoursQuery execution\n", error)
        return error = {
            error: error,
            location: "locateHoursQuery", 
            msg: "An error occured in locateHoursQuery execution"
        }
    }
}


//  TODO: Needs commenting
async function checkParamsAreInt(resolve, reject, req, res) {

    const results = await checkParamIsInt(resolve, reject, req, res, multiple_checks = hours)
    console.log(results)

}


//  TODO: Needs commenting
async function checkParamsAreInRange(resolve, reject, req, res) {
    console.log("Inside checkIntAreInRange", hours)
    let valuesInRange = false  // Initialized with false.

    // ----------------------- Use for hours.js -------------------
    //  Call function intergerInRange for each property value in hours that 
    //  is not null.
    //  TODO: Better commenting.
    const keysOutOfRange = []
    for (const key in hours) {
        if (Object.hasOwnProperty.call(hours, key)) {
            const element = hours[key];
            console.log("The element: ", element)
            console.log("The key: ", key)
            //  Checked for each property of hours.
            if (element !== null) {
                const results = await checkIntIsInRange(
                    resolve, reject, req, res, multiple_checks = hours
                )
                console.log(results)
                keysOutOfRange.push(results)
            }
        }
        console.log("KeysOutOfRange returned: ", keysOutOfRange)
    }

    //  After all keys within hours object has been checked to be in range,
    //  valuesInRange will determine if the current promise resolves true or false.
    if (valuesInRange) {
        resolve(true)
    } else {
        errorHandler.OutOfRangeErrors(req, res, keysOutOfRange) 
        resolve(false)
    }
}


//  TODO: Needs commenting
async function searchResults(from, to) {
    try {
        console.log("from value: ", from)
        console.log("to value: ", to)
        // Waits to recieve a fulfilled promise from findHour() then returns data.
        return await weatherData.findHours(from, to)        
    } catch (error) {
        console.log("Something went wrong in hourDataRetrieved execution \n", error)
        //  Returns error if findHour() code fails to execute.
        // return error
    }
}

async function checkForNoFromParam(req, res, error, url) {
    try {
        console.log("Inside checkForNoHourParams: ", error)
        //  Check if no from parameter found should be resolved by getInstructions or
        //  errorHandler.
        if (
            url.search === "" &&
            url.pathname === "/weather/hours" || 
            url.pathname === "/weather/hours/" 
            ) {
            console.log("Being sent to getInstructions from checkForNoHoursParams: ", 
            error)
            getInstructions(req, res, error = `Must follow hours with a ?from parameter 
            followed by a from value.`)
        } else {
            //  Send call to errorHandler that no from param was found.
            errorHandler.sendOutErrors(req, res, error = "noFromParamValueFound")
        }
    } catch (error) {
        //  Return error
        console.log("An error occured in checkForNoHoursParams execution \n", error)
    }
}


module.exports = {
    isHoursSearchSuccessful
}