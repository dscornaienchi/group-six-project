var APIKey = "e8dad390ebbd6c69a9686f2a12eedb94";
var service;
var lat;
var lon;
var selectedType;

$('#preferences-dropdowns').on('submit', function (event) {
  event.preventDefault();

  var cityName = $('#city-input').val().trim();
  selectedType = $('#dropdown-2').val();

  if (cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (cityData) {
        if (cityData.coord) {
          lat = cityData.coord.lat;
          lon = cityData.coord.lon;

          initMap(lat, lon);

          var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

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
        var dayNumber = 1;
        for (var i = 0; i < forecastData.list.length; i++) {
          var forecastItem = forecastData.list[i];
          if (forecastItem.dt_txt.includes("15:00:00")) {
            var forecastDate = forecastItem.dt_txt;
            var forecastIconCode = forecastItem.weather[0].icon;
            var forecastTemp = forecastItem.main.temp;
            var forecastWind = forecastItem.wind.speed;
            var forecastHumidity = forecastItem.main.humidity;

            updateCityForecast(dayNumber, forecastDate, forecastIconCode, forecastTemp, forecastWind, forecastHumidity);
            dayNumber++;
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        alert('Error fetching data. Please try again');
      });

    clearPlacesList();

  } else {
    alert('City coordinates not found.');
  }
});

function fetchPlaces(cityName, selectedType) {
  const cityMap = {
    lat: lat,
    lng: lon,
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: cityMap,
    zoom: 12,
  });
  service = new google.maps.places.PlacesService(map);

  const request = {
    location: cityMap,
    radius: 500,
    type: selectedType,
  };

  // Perform a nearby search based on the selected type
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
    } else {
      console.error('Error fetching places:', status);
    }
  });
}

function clearPlacesList() {
  var placesList = document.getElementById("places");
  placesList.innerHTML = '';
}

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

function initMap(lat, lon) {
  const cityMap = {
    lat: lat,
    lng: lon,
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: cityMap,
    zoom: 12,
  });

  service = new google.maps.places.PlacesService(map);

  service.nearbySearch({
    location: cityMap,
    radius: 500,
    type: selectedType
  },
  (results, status) => {
    if (status !== "OK" || !results) return;

    addPlaces(results, map, selectedType);
  });
}

function addPlaces(places, map, selectedType) {
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
      };

    }
  placesList.innerHTML = '';


  for (const place of places) {
    if (place.types.includes(selectedType)) {
      const li = document.createElement("li");
      li.textContent = place.name+" "+place.rating;
      placesList.appendChild(li);
      li.addEventListener("click", () => {
        map.setCenter(place.geometry.location);
      });
    }
  }
}

window.initMap = initMap;