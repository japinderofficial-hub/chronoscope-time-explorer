// Get elements from HTML by id.
const yearInput = document.getElementById("yearInput");
const countrySelect = document.getElementById("countrySelect");
const exploreBtn = document.getElementById("exploreBtn");
const themeBtn = document.getElementById("themeBtn");
const quoteText = document.getElementById("quoteText");
const historyList = document.getElementById("historyList");
const weatherText = document.getElementById("weatherText");
const newsList = document.getElementById("newsList");
const movieList = document.getElementById("movieList");

// Load one random quote.
function loadQuote() {
	quoteText.textContent = "Loading quote...";
	fetch("https://api.quotable.io/random")
		.then((res) => res.json())
		.then((data) => {
			quoteText.textContent = '"' + data.content + '" — ' + data.author;
		})
		.catch(() => {
			quoteText.textContent = "Quote not available now.";
		});
}

// Load history from Wikipedia.
function loadHistory() {
	const year = yearInput.value;
	const country = countrySelect.options[countrySelect.selectedIndex].text;
	historyList.innerHTML = "<li>Loading history...</li>";
	const q = encodeURIComponent(year + " " + country + " history");
	const url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + q + "&format=json&origin=*";
	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			const items = data.query.search || [];
			let html = "";
			for (let i = 0; i < items.length && i < 5; i++) {
				html += "<li>" + items[i].title + "</li>";
			}
			historyList.innerHTML = html || "<li>No history found.</li>";
		})
		.catch(() => {
			historyList.innerHTML = "<li>History not available now.</li>";
		});
}

// Load weather using selected country latitude and longitude.
function loadWeather() {
	const selected = countrySelect.options[countrySelect.selectedIndex];
	const lat = selected.getAttribute("data-lat");
	const lon = selected.getAttribute("data-lon");
	weatherText.textContent = "Loading weather...";
	const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,wind_speed_10m&timezone=auto";
	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			weatherText.textContent = "Temp " + data.current.temperature_2m + "°C, Wind " + data.current.wind_speed_10m + " km/h";
		})
		.catch(() => {
			weatherText.textContent = "Weather not available now.";
		});
}

// Run all simple sections.
function explore() {
	loadQuote();
	loadHistory();
	loadWeather();
	newsList.innerHTML = "<li>Basic version: news not added.</li>";
	movieList.innerHTML = "<li>Basic version: movies not added.</li>";
}

// Click events.
exploreBtn.onclick = explore;
themeBtn.onclick = function () {
	document.body.classList.toggle("dark");
};

// Load data one time when page opens.
explore();
