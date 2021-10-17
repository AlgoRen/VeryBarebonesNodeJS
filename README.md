# Welcome to ZBK's Backend with Vanilla NodeJs
## Purpose
### This application aims to create a very barebones version of **ZBK's Backend** functionality using only Vanilla *NodeJS*, no Express, so to do this, we are making a straightforward *REST API*. Our REST API will receive query params for location and timeframe data and return the correct weather data. ~~Our API will also receive JSON data for obstacle type, level of difficulty range, and city to return locations that meet the specifications.~~

<br>
<hr/>
<br/>

## Objective
### ***The primary objective*** is to create a server that runs a RESTful API that can receive location and timeframe data within a URL and return the correct weather data stored within our data folder.

### ~~***The Secondary objective*** is to create a server that runs a RESTful API that can receive a 'level of difficulty' (numerical), 'obstacle type' (text) and 'city name' (text) data within the request's body. Once received, return the correct location data stored within our data folder that match the set conditions.~~

<br>
<hr/>
<br/>

## Update
### There have been changes to the purpose of this application. I have decided to limit this REST API to return weather data only for the following reasons:
#### 1) An extensive amount of time had to be spent organizing the proper routing without Express.
#### 2) I will be using the features of this application in a personal product and would like to protect some of my intellectual property.
#### 3) I will be making this API again using Express, so I rather not do too much of what I will be doing again. If I decide to make that project public, I will provide a link to it here.

<br>
<hr/>
<br/>

## How To Use
### The code for this repository is for a backend API application, so to interact, you will need to either to either enter your data in your browser's search bar or use a service such as Postman. Weather data returns in the form of a JSON object and insutrctions as an HTML file.
### <b> Routes to get you started: </b>

- http://localhost:5000/ and http://localhost:5000/weather/ 
<p>Gives you an overview of this API. </p>

- http://localhost:5000/weather/hour/
<p>Gives you an overview of accessing the /hour route.</p>

- http://localhost:5000/weather/hours/
<p>Gives you an overview of accessing the /hours route.</p>




## README Changes
- Added Update section
- Removed last sentence in purpose description
- Removed secondary objective
- Grammar fixes
- Added How To Use section