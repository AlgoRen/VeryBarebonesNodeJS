const weatherData = require('../../model/weatherModel')
const errorHandler = require('../error')

async function isHoursSearchSuccessful (req, res) {
    try {
        //  Validate 'to' parameter and store either resolve or reject result in toParamValid
        const toParamValid = new Promise((resolve, reject) => locateToParam(resolve, reject, req, res))
        //  Validate 'from' parameter and store either resolve or reject result in fromParamValid
        const fromParamValid = new Promise((resolve, reject) => locateFromParam(resolve, reject, req, res))
        //  A Promise All call that handles rejections and continues with all promises 
        //  before settling.
        const paramsAreValid = await Promise.all([
            //  If toParamValid is settle with a rejection at any point then this catch
            //  condition will be triggered sending out a false boolean and the error.
            toParamValid.catch(error => {
                //  Call errorHandler to send out error.
                console.log("Error from toParamValid catch", error)
                //  Return false.
                return error
            }), 
            fromParamValid.catch(error => {
                //  Call errorHandler to send out error.
                console.log("Error from fromParamValid catch", error)
                //  Return false.
                return error
            })
        ]).then(results => {
            //  Call function to get data and return results if both promise are 
            //  successful.
            console.log("Successful results for searchResults: ")
            console.log("toParamValid is ", results[0])
            console.log("fromParamValid is ", results[1])
            return true
            // if (results[0][0], results[1][0] !== true) {
            //     // Make await call to retrieve data from weather model and resolve results.
            //     //  Return results if both results returned are successful
            //     console.log("Is this going off??")
            //     return "data"
                
            // } else {
            //     //  errorHandler call
            //     console.log(results)
            // }
        })
 
        //  Possible put this in another try-catch?
        console.log("A quick console log of paramsAreValid: ", paramsAreValid)
        //  A returned result of true from paramsAreValid will initiate the call to use
        //  url.search params to and from as values for retrieving the weather data
        //  from an await call to searchResults
        if (paramsAreValid === true)  {
            //  TODO: Get to and from search parameters from url.search
            const hoursFound = await searchResults(to = 19, from = 22)
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
async function locateToParam(resolve, reject, req, res) {
    resolve([true, "Successful"])
}
//  TODO: Needs commenting
async function locateFromParam(resolve, reject, req, res) {
    resolve([true, "Successful"])
}
//  TODO: Needs commenting
async function searchResults(to, from) {
    try {
        console.log("to value: ", to)
        console.log("from value: ", from)
        // Waits to recieve a fulfilled promise from findHour() then returns data.
        return await weatherData.findHours(to, from)        
    } catch (error) {
        console.log("Something went wrong in hourDataRetrieved execution \n", error)
        //  Returns error if findHour() code fails to execute.
        // return error
    }
}


module.exports = {
    isHoursSearchSuccessful
}