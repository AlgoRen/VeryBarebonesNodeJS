//  A helper function to send out helpful responses depending on what went wrong.
function sendOutErrors(req, res, errorCode) {
    console.log("is this the right error code?")
    console.log(errorCode)

    switch (errorCode) {
        // ~~~~ Hour orientated errors ~~~
        case 'noHourDataFound':
            res.writeHead(404, {"Content-Type": "application/json"})
            res.end(JSON.stringify({"message": "Could not find any weather data for this hour."}))
            break;
        case 'noTimeParamValueFound':
            res.writeHead(400, {"Content-Type": "application/json"})
            res.end(JSON.stringify({"message": "Error: A time param found with no hour value. Please try again with a value between 0 and 23."}))
            break;
        case 'noTimeParamFound':
            res.writeHead(400, {"Content-Type": "application/json"})
            res.end(JSON.stringify({"message": "Error: No time param following '/hour'. Please try again with ?time={0-23}."}))
            break;
        case 'incorrectParamForHourCall':
            res.writeHead(400, {"Content-Type": "application/json"})
            res.end(JSON.stringify({"message": "Error: Hour parameter is not formatted correctly."}))
            break;
        case 'timeValueMustBeAnIntValue':
            res.writeHead(400, {"Content-Type": "application/json"})
            res.end(JSON.stringify({"message": "Error: The search param 'time' value must be a numerical value. Please try again with a value between 0 and 23."}))
            break;
        case 'timeValueOutsideOfRange':
            res.writeHead(400, {"Content-Type": "application/json"})
            res.end(JSON.stringify({"message": "Error: The search param 'time' value must be between 0 and 23. Please try again with a value between 0 and 23."}))
            break;
        // ~~~~ City orientated errors ~~~
        case 'noCityDataFound':
            res.writeHead(404, {"Content-Type": "application/json"})
            res.end(JSON.stringify({"message": "Could not find any weather data for this city."}))
            break;
        case 'noCityParamValueFound':
            res.writeHead(404, {"Content-Type": "application/json"})
            res.end(JSON.stringify({"message": "Error: No city name after city/. Please try again with a city name."}))
            break;
        // ~~~~ Route orientated errors ~~~
        case 'routeNotFound':
            res.writeHead(404, {"Content-Type": "application/json"})
            res.end(JSON.stringify({"message": "Unable to find a route that matches this url. Check for a typo."}))
            break;
        // ~~~~ Fallback error / Async-catch error ~~~
        default:
            res.writeHead(500, {"Content-Type": "application/json"})
            res.end(JSON.stringify({"message": "Well thats nots not supposed to happen..."}))
            break;
    }

    // Potential additional errors to add:
    // const noCityNameErrorMessage =
    // "Error likely due to no city following '/city/'. Please try again with a city name."
}


module.exports = {
    sendOutErrors
}