const userTab = document.querySelector("[user-weather]");
const searchTab = document.querySelector("[search-weather]");
const userContainer = document.querySelector(".weather-container");
const locationAccess = document.querySelector(".location-access"); // grantAccessContainer
const searchScreen = document.querySelector(".search-container"); //searchForm
const loadingScreen = document.querySelector(".loading-container");
const weatherCard = document.querySelector(".weather"); // userInfoContainer

let currentTab = userTab;
const API_KEY = "d433da6f9103395278fcfc182a123613";
currentTab.classList.add("current-tab");
getDataFromStorage();

// switching between both tab function
function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchScreen.classList.contains("active")) {
      weatherCard.classList.remove("active");
      locationAccess.classList.remove("active");
      loadingScreen.classList.remove("active");
      searchScreen.classList.add("active");
    } else {
      searchScreen.classList.remove("active");
      weatherCard.classList.remove("active");
      getDataFromStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  // passed clicked tab as an input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  // passed clicked tab as an input parameter
  switchTab(searchTab);
});

// collect data from local storage
function getDataFromStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  if (!localCoordinates) {
    locationAccess.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

// API Call
async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // as now going to call the API which means , there is need to remove the grant access page add the loader page
  locationAccess.classList.remove("active");
  loadingScreen.classList.add("active");

  // API Call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    //Converting API Data in Json format
    const data = await response.json();
    loadingScreen.classList.remove("active");
    weatherCard.classList.add("active");

    // it render the API data on UI
    renderAPIData(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    console.log("error !! location not found");
  }
}

function renderAPIData(weatherInfo) {
  // fetching the required elements

  const cityName = document.querySelector("[city-name]");
  const countryFlag = document.querySelector("[country-flag]");
  const weatherDis = document.querySelector("[weather-type]");
  const weatherImg = document.querySelector("[weather-img]");
  const temperature = document.querySelector("[temp]");
  const windSpeed = document.querySelector("[wind]");
  const humidity = document.querySelector("[humid]");
  const cloudiness = document.querySelector("[cloud]");

  // fetch values from weather info object and put it UI elements
  cityName.innerText = weatherInfo?.name; //syntax to fetch data from JSON
  countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  weatherDis.innerText = weatherInfo?.weather?.[0]?.description;
  weatherImg.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${weatherInfo?.main?.temp} °C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Not Found");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const accessBtn = document.querySelector("[grant-access]");
accessBtn.addEventListener("click", getLocation);

const searchInput = document.querySelector("[search-input]");

searchScreen.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

// API Call
async function fetchSearchWeatherInfo(city) {
  //coordinates
  loadingScreen.classList.add("active");
  weatherCard.classList.remove("active");
  locationAccess.classList.remove("active");

  // API Call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    //Converting API Data in Json format
    const data = await response.json();
    loadingScreen.classList.remove("active");
    weatherCard.classList.add("active");

    // it render the API data on UI
    renderAPIData(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    console.log("error !! location not found");
  }
}
