//  Controller for handling the use of routes that provide instructions, 
//  error handling, and other misc. uses.
const url = require('url')

const readInstructions = require('../model/index')

// const hourCityWeatherURL = new UrlPattern('/weather(/:anything)(/hour?time=)(:validhour)')
// const allWeatherURL = new UrlPattern('/weather(/:anything)(/all)')

//  Uses an async Await function to get instructions based on the passed in req
//  parameter to call the appropriate method on readInstructions module.

//  @desc   Get instructions on how to use api
//  @route  '/' or any route not defined as a valid route
async function getInstructions(req, res) {
    try {
        //  Use a switch case to get the route, using req, to load correct 
        //  instructions. Currently defaulting to load main route instructions, 
        //  as it is the only one I've completed thus far.

        console.log("Inside getInstructions: \n" + req.url.split('/')[3])
        console.log("Inside getInstructions: \n" + req.url.split('/')[2])

        let weatherHourInstructions = ''
        let weatherHoursInstructions = ''

        //  Switch case to determine which set of instructions should be returned.
        switch (true) {
            //  Splits the req.url into an array and checks the third index for
            // a value of 'hour' Ex: /weather/hour/whateverelse/maybesent
            // Note the first index value of req.url returns an empty string and
            // the second index value is 'weather'.
            case req.url.split('/')[2] === 'hour':
                weatherHourInstructions = await readInstructions.getWeatherHourRouteInstructions()
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(weatherHourInstructions)
                break;

            case req.url.split('/')[3] === 'hour':
                weatherHourInstructions = await readInstructions.getWeatherHourRouteInstructions()
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(weatherHourInstructions)
                break;


            //  Splits the req.url into an array and checks the third index for
            // a value of 'hours' Ex: /weather/hours/whateverelse/maybesent
            // Note the first index value of req.url returns an empty string and
            // the second index value is 'weather'.
            case req.url.split('/')[2] === 'hours':
                weatherHoursInstructions = await readInstructions.getWeatherHoursRouteInstructions()
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(weatherHourInstructions)
                break;

            case req.url.split('/')[3] === 'hours':
                weatherHoursInstructions = await readInstructions.getWeatherHoursRouteInstructions()
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(weatherHourInstructions)
                break;

            default:
                const mainRouteInstructions = await readInstructions.getMainRouteInstructions()
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(mainRouteInstructions)
                break;
        }

    } catch (error) {
        //  Simply throw error
        if (error) throw error
    }
}


module.exports = {
    getInstructions
}