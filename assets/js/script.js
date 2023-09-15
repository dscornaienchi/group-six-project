$(function(){

    var APIKey = "e8dad390ebbd6c69a9686f2a12eedb94";

    //retrieve a list of cities from local storage. This will be for displaying the cities on the left hand side
    var cityList = JSON.parse(localStorage.getItem ('cityList')) || [];

    //Need to add logic for listening for the click of a city 

    // TO DELETE. This data will be fed by city choice of user once logic is added 
    var lat = 32.7668;
    var lon = -96.7836;

    // URL for weather forecast data
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

    // fetch weather forecast data from API
    fetch(forecastURL)
    .then(function (response) {
        return response.json();
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
                //TURN THIS BACK ON LATER updateCityForecast(dayNumber, forecastDate, forecastIconCode, forecastTemp, forecastWind, forecastHumidity, `Day-${dayNumber}`);
                //dayNumber++;
            }
        }
    })
    //TURN THIS BACK ON LATER.catch(function (forecastError) {
        //console.log(forecastError);
        //alert('Error fetching forecast data. Please try again');
    //});

    // function to display after the API is fetched
    function updateCityForecast(dayNumber, forecastDate, forecastIconCode, forecastTempKelvin, forecastWind, forecastHumidity, cardId) {
        var forecastTempFahrenheit = Math.round((forecastTempKelvin - 273.15) * 9/5 + 32);
        var forecastIconURL = `https://openweathermap.org/img/w/${forecastIconCode}.png`;

        var formattedDate = dayjs(forecastDate).format('M/DD/YYYY');

        var forecastDayElement = document.getElementById(cardId);

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

    
    const url = 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?sourceAirportCode=BOM&destinationAirportCode=DEL&date=%3CREQUIRED%3E&itineraryType=%3CREQUIRED%3E&sortOrder=%3CREQUIRED%3E&numAdults=1&numSeniors=0&classOfService=%3CREQUIRED%3E&pageNumber=1&currencyCode=USD';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '518d26ed54msh546e4d1bfb01037p16123fjsnf27b800f92fd',
            'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        }
    };
    
    fetch(url, options)
          .then( function (response) {
            return response.json();
          })
          .then (function (data) {
            console.log(data);
          })
});