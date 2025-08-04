const searchBtn = document.getElementById("search");
const locationbtn = document.getElementById("currentLocation");
const input = document.getElementById("searchInput");
const lower = document.querySelector(".lower");
const clearBtn = document.getElementById("clearInput");


input.addEventListener("input", () => {
  clearBtn.classList.toggle("visible", input.value !== "");
  clearBtn.classList.toggle("hidden", input.value === "");
});

async function fetchWeatherByCity(city) {
  try {
    const weatherData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = weatherData.json();
    return data;
  } catch (error) {
    console.log("Not able to fetch ", error);
  }
}

async function fetchWeatherByCoords(latitude, longitude) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=df0b7f7cb0968435fd8333c197bd2b11&units=metric`
  );
  const data = await response.json();
  return data;
}
async function getWeatherByCity() {
  try {
    const city = input.value.trim();
    if (!city) return alert("Please enter a city name");
    const cityData = await fetchWeatherByCity(city);
    if (cityData.cod === "404") {
      lower.innerHTML = "<p>City not found</p>";
      return;
    }
    updateInfo(cityData);
  } catch (error) {
    console.log("Not able to fetch ", error);
  }
}
function getWeatherByCoords() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const locationData = await fetchWeatherByCoords(lat, lon);
      updateInfo(locationData);
      input.value = "";
    },
    (error) => {
      console.error("Enable to get location", error);
    }
  );
}

function updateInfo({ name, main, wind, weather }) {
  const condition = weather[0].main.toLowerCase();
  setBackground(condition);
  lower.innerHTML = `   <p id="temp">${main.temp}&deg;C</p>
                <br>
                <p id="city">${name}</p>
                <br>
                <p id="description">${weather[0].description}</p>
                <div class="details">
                    <div class="feelsLike">
                        <p>Feels like</p>
                        <p id="wind">${main.feels_like}&deg;C</p>
                    </div>
                    <div class="wind">
                        <p>Wind</p>
                        <p id="wind">${wind.speed}km/h</p>
                    </div>
                    <div class="pressure">
                        <p>Pressure</p>
                        <p id="pressure">${main.pressure}pa</p>
                    </div>
                    <div class="humidity">
                        <p>Humidity</p>
                        <p id="humidity">${main.humidity}%</p>
                    </div>
                </div>`;
}

function setBackground(condition) {
  const body = document.body;
  let imageUrl = "";
  switch (condition) {
    case "clear":
      imageUrl =
        "https://www.shutterstock.com/shutterstock/videos/1092007221/thumb/1.jpg?ip=x480";
      break;
    case "clouds":
      imageUrl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5oCK5vI3c-uIqSeuwcl9G-ScHF9NP5ZCMmQ&s";
      break;
    case "rain":
      imageUrl =
        "https://img.freepik.com/free-vector/background-with-rain-dark-sky_1308-10107.jpg?ga=GA1.1.145717916.1745844129&semt=ais_hybrid&w=740";
      break;
    case "snow":
      imageUrl =
        "https://img.freepik.com/free-vector/snow-winter-background-sky-landscape-with-cold-cloud-blizzard-stylized-blurred-snowflakes-snowdrift-realistic-style_333792-43.jpg?ga=GA1.1.145717916.1745844129&semt=ais_hybrid&w=740";
      break;
    case "thunderstorm":
      imageUrl =
        "https://img.freepik.com/free-photo/weather-effects-composition_23-2149853308.jpg?ga=GA1.1.145717916.1745844129&semt=ais_hybrid&w=740.jpg";
      break;
    case "drizzle":
      imageUrl =
        "https://www.weatherstreet.com/weatherquestions/freezing_drizzle.jpg";
      break;
    case "mist":
    case "fog":
    case "haze":
      imageUrl =
        "https://images.pexels.com/photos/978844/pexels-photo-978844.jpeg?cs=srgb&dl=pexels-xperimental-978844.jpg&fm=jpg";
      break;
    default:
      imageUrl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgyC8gReZ4RtauxTzgODM1Zi2qt8wx8ZGK1g&s";
  }
  body.style.backgroundImage = `url('${imageUrl}')`;
}

searchBtn.addEventListener("click", getWeatherByCity);
locationbtn.addEventListener("click", getWeatherByCoords);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeatherByCity();
  }
});

clearBtn.addEventListener("click", () => {
  input.value = "";
});
