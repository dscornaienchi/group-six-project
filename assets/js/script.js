var APIKey = "e8dad390ebbd6c69a9686f2a12eedb94";
var service;
var moreButton;
var lat;
var lon;
var selectedType; // Added a variable to store the selected type

$('#preferences-dropdowns').on('submit', function (event) {
  event.preventDefault();

  var cityName = $('#city-input').val().trim();
  selectedType = $('#dropdown-2').val(); // Store the selected type

  if (cityName) {
      // Construct the API URL for city data using the cityName
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`)
          .then(function (response) {
              return response.json();
          })
          .then(function (cityData) {
              if (cityData.coord) {
                  lat = cityData.coord.lat; // Store lat and lon in global variables
                  lon = cityData.coord.lon;

                  // Call initMap with lat and lon
                  initMap(lat, lon);

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
              // Process and display the 5-day forecast
              var dayNumber = 1;
              for (var i = 0; i < forecastData.list.length; i++) {
                  var forecastItem = forecastData.list[i];
                  if (forecastItem.dt_txt.includes("15:00:00")) {
                      var forecastDate = forecastItem.dt_txt;
                      var forecastIconCode = forecastItem.weather[0].icon;
                      var forecastTemp = forecastItem.main.temp;
                      var forecastWind = forecastItem.wind.speed;
                      var forecastHumidity = forecastItem.main.humidity;

                      // Update the HTML display with the forecast data
                      updateCityForecast(dayNumber, forecastDate, forecastIconCode, forecastTemp, forecastWind, forecastHumidity);
                      dayNumber++;
                  }
              }
          })
          .catch(function (error) {
              console.log(error);
              alert('Error fetching data. Please try again');
          });

    // Clear the places list before populating it
    clearPlacesList();

    // Pass cityName and selectedType to fetchPlaces
    fetchPlaces(cityName, selectedType);
  } else {
    alert('City coordinates not found.');
  }
});

// Function to fetch places based on the selected type
function fetchPlaces(cityName, selectedType) {
  // Create the map.
  const cityMap = {
    lat: lat,
    lng: lon,
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: cityMap,
    zoom: 12,
  });
  // Create the places service.
  service = new google.maps.places.PlacesService(map);

  // Define the search request
  const request = {
    location: cityMap,
    radius: 500,
    type: selectedType, // Use the selectedType as the type parameter
  };

  // Perform a nearby search based on the selected type
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Pass selectedType to the addPlaces function
      addPlaces(results, map, selectedType);
    } else {
      console.error('Error fetching places:', status);
    }
  });

  // Enable the "Load more results" button
  moreButton = document.getElementById("more");
  moreButton.disabled = false;
}

// Function to clear the places list
function clearPlacesList() {
  var placesList = document.getElementById("places");
  placesList.innerHTML = ''; // Clear the inner HTML of the places list
}

// Function to display the forecast in the City Forecast section
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

// Google Maps API
function initMap(lat, lon) {
  // Create the map.
  const cityMap = {
    lat: lat,
    lng: lon,
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: cityMap,
    zoom: 12,
  });

  // Ensure that the moreButton element is defined and available
  moreButton = document.getElementById("more");
  if (moreButton) {
    moreButton.onclick = function() {
      moreButton.disabled = true;
      if (getNextPage) {
        getNextPage();
      }
    };
  }

  service = new google.maps.places.PlacesService(map);
  let getNextPage;

  // Perform a nearby search.
  service.nearbySearch({
    location: cityMap,
    radius: 500,
    type: selectedType 
  },
  (results, status, pagination) => {
    if (status !== "OK" || !results) return;

    addPlaces(results, map, selectedType); // Pass selectedType to addPlaces
    moreButton.disabled = !pagination || !pagination.hasNextPage;
    if (pagination && pagination.hasNextPage) {
      getNextPage = () => {
        // Note: nextPage will call the same handler function as the initial call
        pagination.nextPage();
      };
    }
  });
}

// Function to add filtered places to the list
function addPlaces(places, map, selectedType) {
  const placesList = document.getElementById("places");
  
  // Clear the places list before populating it
  placesList.innerHTML = '';
  
  for (const place of places) {
    if (place.types.includes(selectedType)) { // Check if the place type matches the selected type
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
