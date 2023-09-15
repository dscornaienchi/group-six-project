$(function(){

    var APIKey = "e8dad390ebbd6c69a9686f2a12eedb94";

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
});