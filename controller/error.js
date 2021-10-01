function confirmCorrectParams(urlString) {

    return new Promise((resolve, reject) => {
        let hourToSearch = -1  //  Set to -1 to represent a false value
        const hourParams = urlString.slice(urlString.indexOf('?'))
        console.log("Hour parameters: " + hourParams)

        if (hourParams.indexOf('time=') > 0) {
            //  Int copy of number representing hour.. 
            //  The ugliest one liner within this application. soz ;c
            hourToSearch = parseInt(hourParams.slice(hourParams.indexOf('=') + 1))
            console.log("This should be equal to search hour: ")
            console.log(hourToSearch)
            resolve(hourToSearch)
        } else {
            console.log("Did not find a 'time=' param")
            reject('incorrectParamForHourCall')

            //  Call user to check instructions
            // getWeatherHourRouteInstructions(req, res)
        }
    })
}

function sendOutErrors(req, res, errorCode) {
    console.log("is this the right error code?")
    console.log(errorCode)

    switch (errorCode) {
        case 'incorrectParamForHourCall':
            res.writeHead(401, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ "message": "Hour parameter is not formatted correctly." }))
            break;
        case 'hourMustBeAnIntValue':
            res.writeHead(401, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ "message": "Error: Hour must be a numerical value." }))
            break;
        case 'hourValueOutsideOfRange':
            res.writeHead(401, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ "message": "Error: Hour must be between 0 and 23. Please try again with a city name." }))
            break;
        case 'noCityDataFound':
            res.writeHead(401, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ "message": "Could not find any weather data for this city." }))
            break;
        case 'routeNotFound':
            res.writeHead(404, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ "message": "Unable to find a route that matches this url. Check for a typo." }))
            break;
        default:
            res.writeHead(401, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ "message": "Well thats nots not supposed to happen..." }))
            break;
    }

    // Potential additional errors to add:
    // const noCityNameErrorMessage =
    // "Error likely due to no city following '/city/'. Please try again with a city name."
    // const noHourParamsErrorMessage =
    // "Error likely due to no time param following '/hour'. Please try again with ?time={0-23}."
}


module.exports = {
    confirmCorrectParams,
    sendOutErrors
}