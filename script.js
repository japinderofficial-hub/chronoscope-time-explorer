const btn = document.getElementById("btn");
const yearInput = document.getElementById("year");
const countryInput = document.getElementById("country");
const eventsList = document.getElementById("events");
const newsList = document.getElementById("news");
const moviesList = document.getElementById("movies");
const weatherBox = document.getElementById("weather");
const quoteText = document.getElementById("quote");
btn.addEventListener("click", () => {
    let year = yearInput.value;
    let country = countryInput.value;
    if (year === "" || country === "") {
        alert("Please enter both year and country!");
        return;
    }
    getEvents(year, country);
    getNews(year, country);
    getMovies(year);
    getWeather(country);
});
async function getQuote() {
    let response = await fetch("https://dummyjson.com/quotes/random");
    let data = await response.json();
    quoteText.innerText = `"${data.quote}" - ${data.author}`;
}
getQuote();
async function getEvents(year, country) {
    let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${year}+in+${country}&utf8=&format=json&origin=*`;
    let response = await fetch(url);
    let data = await response.json();
    eventsList.innerHTML = "";
    let top3 = data.query.search.slice(0, 3);
    top3.forEach(item => {
        eventsList.innerHTML += `<li>${item.title}</li>`;
    });
}
async function getNews(year, country) {
    let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${year}+news+in+${country}&utf8=&format=json&origin=*`;
    let response = await fetch(url);
    let data = await response.json();
    newsList.innerHTML = "";
    if(data.query.search.length === 0) {
        newsList.innerHTML = "<li>No news found.</li>";
        return;
    }
    let top3 = data.query.search.slice(0, 3);
    top3.forEach(item => {
        newsList.innerHTML += `<li>${item.title}</li>`;
    });
}
async function getMovies(year) {
    let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=highest+grossing+films+${year}&utf8=&format=json&origin=*`;
    let response = await fetch(url);
    let data = await response.json();
    moviesList.innerHTML = "";
    if(data.query.search.length === 0) {
        moviesList.innerHTML = "<li>No movies found.</li>";
        return;
    }
    let top3 = data.query.search.slice(0, 3);
    top3.forEach(item => {
        moviesList.innerHTML += `<li>${item.title}</li>`;
    });
}
async function getWeather(country) {
    let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${country}&count=1&format=json`;
    let geoResponse = await fetch(geoUrl);
    let geoData = await geoResponse.json();
    if (!geoData.results) {
        weatherBox.innerHTML = "<p>Location not found.</p>";
        return;
    }
    let lat = geoData.results[0].latitude;
    let lon = geoData.results[0].longitude;
    let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    let response = await fetch(weatherUrl);
    let data = await response.json();
    let temp = data.current_weather.temperature;
    let wind = data.current_weather.windspeed;
    weatherBox.innerHTML = `<p>Temp: ${temp}°C</p><p>Wind: ${wind} km/h</p>`;
}
