# Notes on weather.json
The data within weather.json is fictious data that I simplified from an API response 
example data provided by OpenWeather API - Hourly Forecast. The purpose of 
doing this was to create a more easy navigatable JSON object to get practice 
with as the actual data from the OpenWeather API carries a lot more objects to 
traverse through. Having this weather data in a JSON file also saves me from having 
to make repeated API request and using up my free trial license and having to pay 
for a license to use OpenWeather API.

Note that I created the data based on how I would like my first weather algorithim to
recieve its data, hourly. You will also notice a location object within weather.json
this is to replicate that a request for the weather data of a specific location will
most likely include the location data; I find this great, confirmation that the data
I am recieving will match the location that I inputed. Finally, within location
you will notice they are two sets of "id" and "coord" parameters. The "id" and "coord"
parameters directly inside the location object refer to the exact location the 
weather data was requested for, and the "id" and "coord" parameters within city
object refer to the specific city that location is in which may be used for
either catagorization, labeling, or verification purposes.