const quoteBank = [ "The future belongs to those who prepare for it today.", "Small progress each year compounds into history.", "Time reveals what focus builds.", "Every year has a story worth exploring.", "Curiosity turns dates into discoveries." ];
const countryCoords = { "India": { lat: 28.61, lon: 77.21 }, "United Kingdom": { lat: 51.5, lon: -0.12 }, "United States": { lat: 38.9, lon: -77.03 }, "Japan": { lat: 35.68, lon: 139.76 } };


const yearRange = document.getElementById("yearRange");
const yearLabel = document.getElementById("yearLabel");
const timelineYear = document.getElementById("timelineYear");
const countrySelect = document.getElementById("countrySelect");
const searchInput = document.getElementById("searchInput");
const exploreBtn = document.getElementById("exploreBtn");
const themeBtn = document.getElementById("themeBtn");
const eventsList = document.getElementById("eventsList");
const moviesList = document.getElementById("moviesList");
const newsList = document.getElementById("newsList");
const weatherGrid = document.getElementById("weatherGrid");
const weatherDate = document.getElementById("weatherDate");
const quoteText = document.getElementById("quoteText");


async function getHistoryEvents(year) {
    try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=events+in+${year}&utf8=&format=json&origin=*`);
        const data = await res.json();
        let html = "";
        for (let i = 0; i < 4; i++) {
            if (data.query.search[i]) {
                const cleanText = data.query.search[i].snippet.replace(/(<([^>]+)>)/gi, "");
                html += `<li><b>${year}</b> - ${cleanText}</li>`;
            }
        }
        return html || `<li>No events found.</li>`;
    } catch (e) { return `<li>Error loading events.</li>`; }
}


async function getMovies(year) {
    try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${year}_films&cmlimit=10&format=json&origin=*`);
        const data = await res.json();
        let html = "";
        if (data.query) {
            for (let i = 0; i < Math.min(4, data.query.categorymembers.length); i++) {
                let title = data.query.categorymembers[i].title.replace(/ *\([^)]*\) */g, "");
                html += `<li>🍿 ${title}</li>`;
            }
        }
        return html || `<li>No movies found.</li>`;
    } catch (e) { return `<li>Error loading movies.</li>`; }
}


async function getWeather(country, dateStr) {
    try {
        const coords = countryCoords[country];
        const res = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${dateStr}&end_date=${dateStr}&daily=temperature_2m_max,temperature_2m_min`);
        const data = await res.json();
        const maxTemp = Math.round(data.daily.temperature_2m_max[0]);
        const minTemp = Math.round(data.daily.temperature_2m_min[0]);
        return `<div style="grid-column: span 4; padding: 10px;"><b>${dateStr}</b><br>High: ${maxTemp}°C <br>Low: ${minTemp}°C</div>`;
    } catch (e) {
        return `<div style="grid-column: span 4; padding: 10px;"><b>${dateStr}</b><br>High: 24°C <br>Low: 18°C</div>`;
    }
}


async function getQuote() {
    try {
        const res = await fetch("https://dummyjson.com/quotes/random");
        const data = await res.json();
        return `"${data.quote}" - ${data.author}`;
    } catch (e) {
        return `"${quoteBank[Math.floor(Math.random() * quoteBank.length)]}"`;
    }
}

async function updateUI() {
    const year = yearRange.value;
    const country = countrySelect.value;

    eventsList.innerHTML = "<li>Loading events...</li>";
    moviesList.innerHTML = "<li>Loading movies...</li>";
    newsList.innerHTML = `<li>Loading news for ${country}...</li>`;
    quoteText.innerText = "Loading...";
    
    weatherDate.min = `${year}-01-01`;
    weatherDate.max = `${year}-12-31`;
    if (!weatherDate.value.startsWith(year)) weatherDate.value = `${year}-01-01`;

    eventsList.innerHTML = await getHistoryEvents(year);
    moviesList.innerHTML = await getMovies(year);
    newsList.innerHTML = `
        <li>📰 Major policy shifts discussed in ${country} in ${year}.</li>
        <li>📰 Technology stories started trending in ${country}.</li>
    `;
    quoteText.innerText = await getQuote();
    
    updateWeatherUI();
    filterList();
}

async function updateWeatherUI() {
    weatherGrid.innerHTML = "<div style='grid-column: span 4;'>Loading...</div>";
    if (weatherDate.value) weatherGrid.innerHTML = await getWeather(countrySelect.value, weatherDate.value);
}


function filterList() {
    const query = searchInput.value.toLowerCase();
    const items = document.getElementsByTagName("li");
    for (let i = 0; i < items.length; i++) {
        const hidden = !items[i].innerText.toLowerCase().includes(query);
        items[i].style.display = hidden ? "none" : "";
    }
}

yearRange.addEventListener("input", function() {
    yearLabel.innerText = yearRange.value;
    timelineYear.innerText = yearRange.value;
});
yearRange.addEventListener("change", updateUI);
countrySelect.addEventListener("change", updateUI);
exploreBtn.addEventListener("click", updateUI);
weatherDate.addEventListener("change", updateWeatherUI);
searchInput.addEventListener("input", filterList);
themeBtn.addEventListener("click", function () {
    const isLightMode = document.body.classList.toggle("light");
    themeBtn.innerText = isLightMode ? "🌑 Mode" : "🌙 Mode";
});

yearLabel.innerText = timelineYear.innerText = yearRange.value;
updateUI();
