function explore() {
    var year = document.getElementById("year").value;
    var country = document.getElementById("country").value;

    if (year === "" || country === "") {
        alert("Please enter both Year and Country");
        return;
    }

    // Set loading state
    const loader = "<li>Searching...</li>";
    document.getElementById("events").innerHTML = loader;
    document.getElementById("news").innerHTML = loader;
    document.getElementById("movies").innerHTML = loader;
    document.getElementById("weather").innerHTML = "Updating...";

    getEvents(year, country);
    getNews(year, country);
    getMovies(year);
    getWeather(country);
}

async function getEvents(year, country) {
    var res = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + year + " " + country + "&format=json&origin=*");
    var data = await res.json();
    displayList("events", data.query.search);
}

async function getNews(year, country) {
    var res = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + year + " news " + country + "&format=json&origin=*");
    var data = await res.json();
    displayList("news", data.query.search);
}

async function getMovies(year) {
    var res = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=movies " + year + "&format=json&origin=*");
    var data = await res.json();
    displayList("movies", data.query.search);
}

// Helper function to keep code clean
function displayList(id, results) {
    var list = document.getElementById(id);
    list.innerHTML = "";
    for (var i = 0; i < Math.min(3, results.length); i++) {
        var li = document.createElement("li");
        li.innerText = results[i].title;
        list.appendChild(li);
    }
}

async function getWeather(country) {
    try {
        var geo = await fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + country);
        var geoData = await geo.json();

        if (!geoData.results) {
            document.getElementById("weather").innerText = "Location not found";
            return;
        }

        var lat = geoData.results[0].latitude;
        var lon = geoData.results[0].longitude;

        var res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true");
        var data = await res.json();

        document.getElementById("weather").innerText = data.current_weather.temperature + "°C";
    } catch (e) {
        document.getElementById("weather").innerText = "Error loading weather";
    }
}

async function getQuote() {
    var res = await fetch("https://dummyjson.com/quotes/random");
    var data = await res.json();
    document.getElementById("quote").innerText = `"${data.quote}" — ${data.author}`;
}

getQuote();
