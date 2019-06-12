'use strict';

require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application Setup
const PORT = process.env.PORT;
const app = express();

app.use(cors());

app.get('/location', handleLocationRequest);
// app.get('/weather', handleWeatherRequest);

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));


function handleLocationRequest(request, response){
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEO_API_KEY}`;

  return superagent.get(URL)
    .then(res => {
      const location = new Location(request.query.data, res.body);
      response.send(location);
    })

    .catch(error=>{
      handleError(error, response);
    })
}

// function handleWeatherRequest(request, response){
//   const url = `https://api.darksky.net/forecast/`;

// }

//TO DO .MAP - Refactor getWeater callback to use .map and send an array response to client,
// to use darksky to getWeather we NEED API key in the dotenv file, we need latitude and longitude.



// app.get('/location', (request, response) => {

//   try {
//     const locationData = searchToLatLong(request.query.data);
//     response.send(locationData);
//   }

//   catch (error) {
//     console.error(error);
//     response.status(500).send('Status: 500. So sorry, something went wrong.');
//   }
// });

app.get('/weather', (request, response) => {

  try {
    const weatherData = searchWeatherData(request.query.data);
    response.send(weatherArray);
  }

  catch (error) {
    console.error(error);
    response.status(500).send('Status: 500. So sorry, something went wrong.');
  }
});

const weatherArray = [];

// Helper Functions
function Weather(query, time, forecast) {
  this.search_query = query;
  this.time = time;
  this.forecast = forecast;
  weatherArray.push(this);
}


function searchWeatherData(query) {
  const skyData = require('./data/darksky.json');
  for(let i = 0; i < skyData.daily.data.length; i++){
    new Weather(query, skyData.daily.data[i].time, skyData.daily.data[i].summary);
  }
//   const weather = new Weather(query, skyData);
//   return weather;
}

function Location(query, geoData) {
  this.search_query = query;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

// function searchToLatLong(query) {
//   const geoData = require('./data/geo.json')
//   const location = new Location(query, geoData);
//   return location;
// }

function handleError(error, response){
  console.error(error);
  response.status(500).send('Working on it!');
}
