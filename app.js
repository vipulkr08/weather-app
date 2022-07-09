// Select elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data 
const weather = {

};

weather.temperature = {
    unit: "celsius"
}

// App const and vars
const KELVIN = 273;
// API key
const key = "a4bdf2ad191d3243cbb88964ceb19dfd";

// Check if browser supports geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support Geolocation</p>";
}

// Set user's position
function setPosition(postion) {
    let latitude = postion.coords.latitude;
    let longitude = postion.coords.longitude;
    getWeather(latitude, longitude);
}

// Show error when there is an issue with geolocation service
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// Get weather from API provider 
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        })
}

// Display weather to UI 
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celsiusToFaherenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

tempElement.addEventListener("click", function () {
    if (weather.temperature.value == undefined) return;
    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFaherenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F<span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C<span>`;
        weather.temperature.unit = "celsius";
    }
})

