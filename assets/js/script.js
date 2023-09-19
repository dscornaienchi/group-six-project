$(function(){

    var APIKey = "e8dad390ebbd6c69a9686f2a12eedb94";
    var yelpAPIKey = "PHJuz6p-zp_EZyEZU15LhXV9SbiT9I_Q1QkB22KNeuNYM7Pw90btQZuRHRSLV-SwCVlVW-WnQu8lULYo_ODtRE7xRZ7FyC6GBQrpueahhazOAelR2KoO7zRdeOgIZXYx"
    // function to display the forecast in the City Forecast section
    function updateCityForecast(dayNumber, forecastDate, forecastIconCode, forecastTempKelvin, forecastWind, forecastHumidity) {
        var forecastTempFahrenheit = Math.round((forecastTempKelvin - 273.15) * 9/5 + 32);
        var forecastIconURL = `https://openweathermap.org/img/w/${forecastIconCode}.png`;

        var formattedDate = dayjs(forecastDate).format('M/DD/YYYY');

        var forecastDayElement = document.getElementById(`forecast-day-${dayNumber}`);

        if (forecastDayElement) {
            forecastDayElement.innerHTML = `
                <h4>${formattedDate}</h4>
                <img src="${forecastIconURL}" alt="Weather Icon">
                <h4>Temp: ${forecastTempFahrenheit}°F</h4>
                <h4>Wind: ${forecastWind} MPH</h4>
                <h4>Humidity: ${forecastHumidity}%</h4>
            `;
        }
    }

    // Attach a click event handler to each city button
    $('.city-button').on('click', function(event) {
        event.preventDefault();

        var cityName = $(this).text();

        // Construct the API URL for city data using the cityName
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (cityData) {
            if (cityData.coord) {
                var lat = cityData.coord.lat;
                var lon = cityData.coord.lon;

                // Construct the API URL with the latitude and longitude
                var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

                // Fetch weather forecast data from the new URL
                return fetch(forecastURL);
            } else {
                alert('City coordinates not found.');
            }
        })
        .then(function (forecastResponse) {
            return forecastResponse.json();
        })
        .then(function (forecastData) {
            console.log("Forecast data", forecastData);
            // process and display the 5-day forecast
            var dayNumber = 1;
            for (var i = 0; i < forecastData.list.length; i++) {
                var forecastItem = forecastData.list[i];
                if (forecastItem.dt_txt.includes("15:00:00")) {
                    var forecastDate = forecastItem.dt_txt;
                    var forecastIconCode = forecastItem.weather[0].icon;
                    var forecastTemp = forecastItem.main.temp;
                    var forecastWind = forecastItem.wind.speed;
                    var forecastHumidity = forecastItem.main.humidity;

                    // update the HTML display with the forecast data
                    updateCityForecast(dayNumber, forecastDate, forecastIconCode, forecastTemp, forecastWind, forecastHumidity);
                    dayNumber++;
                }
            }
        })
        .catch(function (error) {
            console.log(error);
            alert('Error fetching data. Please try again');
        });
    });
});


// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;

function initMap() {
  const sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 15,
  });

  const request = {
    query: "Museum of Contemporary Art Australia",
    fields: ["name", "geometry"],
  };
// get place w/ place service API
  service = new google.maps.places.PlacesService(map);

//   create marker on map w/ query API
  service.findPlaceFromQuery(request, (results, status) => {
    console.log(results);
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
//   get placeID
var service = new google.maps.places.PlacesService(map);

service.textSearch(request, getPlaceID);
function getPlaceID(results, status) {
    console.log(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        place: {
          placeId: results[0].place_id,
          location: results[0].geometry.location
        }
      });
    }
}
}


function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

window.initMap = initMap;