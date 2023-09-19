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


// google maps api
function initMap() {
  // Create the map.
  const cityMap = {
    lat: 30.2672,
    lng: -97.7431
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: cityMap,
    zoom: 12,
    // mapId: "d98de8ecbc6ba55",
  });
  // Create the places service.
  const service = new google.maps.places.PlacesService(map);
  let getNextPage;
  const moreButton = document.getElementById("more");

  moreButton.onclick = function() {
    moreButton.disabled = true;
    if (getNextPage) {
      getNextPage();
    }
  };

  // Perform a nearby search.
  service.nearbySearch({
      location: cityMap,
      radius: 500,
      type: "cafe"
    },
    (results, status, pagination) => {
      if (status !== "OK" || !results) return;

      addPlaces(results, map);
      moreButton.disabled = !pagination || !pagination.hasNextPage;
      if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
          // Note: nextPage will call the same handler function as the initial call
          pagination.nextPage();
        };
      }
    },
  );
}

function addPlaces(places, map) {
  const placesList = document.getElementById("places");

  for (const place of places) {
    if (place.geometry && place.geometry.location) {
    //   const image = {
    //     url: place.icon,
    //     size: new google.maps.Size(71, 71),
    //     origin: new google.maps.Point(0, 0),
    //     anchor: new google.maps.Point(17, 34),
    //     scaledSize: new google.maps.Size(25, 25),
    //   };

      // new google.maps.Marker({
      //   map,
      //   icon: image,
      //   title: place.name,
      //   position: place.geometry.location,
      // });

      const li = document.createElement("li");

      li.textContent = place.name;
      placesList.appendChild(li);
      li.addEventListener("click", () => {
        map.setCenter(place.geometry.location);
      });
    }
  }
}

window.initMap = initMap;