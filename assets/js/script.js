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