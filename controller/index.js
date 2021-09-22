//  Controller for handling the use of routes that provide instructions, 
//  error handling, and other misc. uses.
const readInstructions = require('../model/index')

//  Uses an async Await function to get instructions based on the passed in req
//  parameter to call the appropriate method on readInstructions module.

//  @desc   Get instructions on how to use api
//  @route  '/' or any route not defined as a valid route
async function getInstructions(req, res) {
    try {
        //  Use a switch case to get the route, using req, to load correct 
        //  instructions. Currently defaulting to load main route instructions, 
        //  as it is the only one I've completed thus far.
        const mainRouteInstructions = await readInstructions.getMainRouteInstructions()
        console.log("Inside getInstructions: " + mainRouteInstructions)
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(mainRouteInstructions)
    } catch (error) {
        //  Simply throw error
        if (error) throw error
    }
}


module.exports = {
    getInstructions
}