class WeatherApp {
  constructor() {
    this.API_KEY = "ebc7e6d6a5516b2cfead85fb9002defe"
    this.BASE_URL = "https://home.openweathermap.org/api_keys"

    this.initializeElements()
    this.bindEvents()
    this.updateDate()


    this.getWeatherData("London")
  }

  initializeElements() {
    this.searchForm = document.getElementById("searchForm")
    this.cityInput = document.getElementById("cityInput")
    this.searchBtn = this.searchForm.querySelector(".search-btn")
    this.errorMessage = document.getElementById("errorMessage")
    this.errorText = document.getElementById("errorText")
    this.loading = document.getElementById("loading")
    this.weatherContent = document.getElementById("weatherContent")


    this.cityName = document.getElementById("cityName")
    this.currentDate = document.getElementById("currentDate")
    this.weatherIcon = document.getElementById("weatherIcon")
    this.weatherDescription = document.getElementById("weatherDescription")
    this.temperature = document.getElementById("temperature")
    this.windSpeed = document.getElementById("windSpeed")
    this.humidity = document.getElementById("humidity")
    this.visibility = document.getElementById("visibility")
  }

  bindEvents() {
    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const city = this.cityInput.value.trim()
      if (city) {
        this.getWeatherData(city)
      }
    })

    
    this.cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        this.searchForm.dispatchEvent(new Event("submit"))
      }
    })
  }

  updateDate() {
    const now = new Date()
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    this.currentDate.textContent = now.toLocaleDateString("en-US", options)
  }

  showLoading() {
    this.loading.style.display = "block"
    this.weatherContent.style.display = "none"
    this.errorMessage.style.display = "none"
    this.searchBtn.disabled = true
  }

  hideLoading() {
    this.loading.style.display = "none"
    this.searchBtn.disabled = false
  }

  showError(message) {
    this.errorText.textContent = message
    this.errorMessage.style.display = "flex"
    this.weatherContent.style.display = "none"
    this.hideLoading()
  }

  showWeatherData() {
    this.weatherContent.style.display = "block"
    this.errorMessage.style.display = "none"
    this.hideLoading()
  }

  getWeatherIcon(weatherMain, weatherId) {
    const iconMap = {
      Clear: "wb_sunny",
      Clouds: "cloud",
      Rain: "umbrella",
      Drizzle: "grain",
      Thunderstorm: "flash_on",
      Snow: "ac_unit",
      Mist: "foggy",
      Smoke: "foggy",
      Haze: "foggy",
      Dust: "foggy",
      Fog: "foggy",
      Sand: "foggy",
      Ash: "foggy",
      Squall: "air",
      Tornado: "tornado",
    }

    return iconMap[weatherMain] || "wb_sunny"
  }

  async getWeatherData(city) {
    this.showLoading()

    try {
      const url = `${this.BASE_URL}?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the spelling and try again.")
        } else if (response.status === 401) {
          throw new Error("API key error. Please try again later.")
        } else {
          throw new Error("Unable to fetch weather data. Please try again.")
        }
      }

      const data = await response.json()
      this.displayWeatherData(data)
    } catch (error) {
      console.error("Weather API Error:", error)
      this.showError(error.message)
    }
  }

  displayWeatherData(data) {
    try {

      this.cityName.textContent = `${data.name}, ${data.sys.country}`


      const weatherMain = data.weather[0].main
      const weatherDescription = data.weather[0].description
      this.weatherIcon.textContent = this.getWeatherIcon(weatherMain)
      this.weatherDescription.textContent = weatherDescription


      const temp = Math.round(data.main.temp)
      this.temperature.textContent = `${temp}°C`


      const windSpeedKmh = Math.round(data.wind.speed * 3.6)
      this.windSpeed.textContent = `${windSpeedKmh} km/h`


      this.humidity.textContent = `${data.main.humidity}%`


      const visibilityKm = data.visibility ? Math.round(data.visibility / 1000) : "N/A"
      this.visibility.textContent = typeof visibilityKm === "number" ? `${visibilityKm} km` : visibilityKm


      this.cityInput.value = ""


      this.showWeatherData()


      this.weatherContent.style.animation = "none"
      this.weatherContent.offsetHeight // Trigger reflow
      this.weatherContent.style.animation = "fadeIn 0.6s ease-out"
    } catch (error) {
      console.error("Error displaying weather data:", error)
      this.showError("Error displaying weather data. Please try again.")
    }
  }
}


document.addEventListener("DOMContentLoaded", () => {
  new WeatherApp()
})


document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".search-btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })


  const weatherCards = document.querySelectorAll(".wind-info, .humidity-info, .visibility-info")
  weatherCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
    card.classList.add("float-animation")
  })
})


const style = document.createElement("style")
style.textContent = `
    .search-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .float-animation {
        animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }
`
document.head.appendChild(style)

const apiKey = "24187e76308498f5275b891df9eb7dba"
const BASE_URL = "https://api.openweathermap.org/data/2.5"


let currentUnit = "celsius"
let currentWeatherData = null
let forecastData = null
let favorites = JSON.parse(localStorage.getItem("weatherFavorites")) || []
let isDarkTheme = localStorage.getItem("darkTheme") === "true"


const elements = {

  cityElement: document.querySelector(".city"),
  temperature: document.querySelector(".temp"),
  windSpeed: document.querySelector(".wind-speed"),
  humidity: document.querySelector(".humidity"),
  visibility: document.querySelector(".visibility-distance"),
  descriptionText: document.querySelector(".description-text"),
  date: document.querySelector(".date"),
  weatherIcon: document.querySelector(".weather-icon"),
  formElement: document.querySelector(".search-form"),
  inputElement: document.querySelector(".city-input"),


  localTime: document.querySelector(".local-time"),
  feelsLike: document.querySelector(".feels-like"),
  tempMax: document.querySelector(".temp-max"),
  tempMin: document.querySelector(".temp-min"),
  windDirection: document.querySelector(".wind-deg"),
  windArrow: document.querySelector(".wind-arrow"),
  humidityFill: document.querySelector(".humidity-fill"),
  visibilityLevel: document.querySelector(".visibility-level"),
  pressure: document.querySelector(".pressure"),
  uvIndex: document.querySelector(".uv-index"),
  sunrise: document.querySelector(".sunrise"),
  sunset: document.querySelector(".sunset"),


  unitBtns: document.querySelectorAll(".unit-btn"),
  themeToggle: document.querySelector(".theme-toggle"),
  locationBtn: document.querySelector(".location-btn"),
  favoritesBtn: document.querySelector(".favorites-btn"),
  addFavorite: document.querySelector(".add-favorite"),


  errorMessage: document.querySelector(".error-message"),
  errorText: document.querySelector(".error-text"),
  loadingContainer: document.querySelector(".loading-container"),
  successMessage: document.querySelector(".success-message"),
  favoritesDropdown: document.querySelector(".favorites-dropdown"),
  favoritesList: document.querySelector(".favorites-list"),
  noFavorites: document.querySelector(".no-favorites"),
  hourlyContainer: document.querySelector(".hourly-container"),
  forecastContainer: document.querySelector(".forecast-container"),


  chartTabs: document.querySelectorAll(".chart-tab"),
  chartCanvas: document.getElementById("weatherChart"),


  searchSuggestions: document.querySelector(".search-suggestions"),
}


document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  bindEvents()
  createParticles()


  if (isDarkTheme) {
    document.documentElement.setAttribute("data-theme", "dark")
  }


  const savedCity = localStorage.getItem("lastCity") || "London"
  fetchWeatherData(savedCity)
})


function initializeApp() {
  updateFavoritesDisplay()
  updateDateTime()


  setInterval(updateDateTime, 60000)
}


function bindEvents() {

  elements.formElement.addEventListener("submit", handleSearch)
  elements.inputElement.addEventListener("input", handleSearchInput)


  elements.unitBtns.forEach((btn) => {
    btn.addEventListener("click", () => toggleUnit(btn.dataset.unit))
  })


  elements.themeToggle.addEventListener("click", toggleTheme)


  elements.locationBtn.addEventListener("click", getCurrentLocation)


  elements.favoritesBtn.addEventListener("click", toggleFavoritesDropdown)
  elements.addFavorite.addEventListener("click", toggleCurrentCityFavorite)


  elements.chartTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchChart(tab.dataset.chart))
  })


  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.target.closest(".error-message, .success-message").style.display = "none"
    })
  })


  document.addEventListener("click", (e) => {
    if (!e.target.closest(".favorites-btn, .favorites-dropdown")) {
      elements.favoritesDropdown.style.display = "none"
    }
    if (!e.target.closest(".search-input-wrapper")) {
      elements.searchSuggestions.style.display = "none"
    }
  })
}


function handleSearch(e) {
  e.preventDefault()
  const city = elements.inputElement.value.trim()
  if (city) {
    fetchWeatherData(city)
    elements.inputElement.value = ""
    elements.searchSuggestions.style.display = "none"
  }
}


function handleSearchInput(e) {
  const query = e.target.value.trim()
  if (query.length > 2) {

    showSearchSuggestions(query)
  } else {
    elements.searchSuggestions.style.display = "none"
  }
}


function showSearchSuggestions(query) {

  const suggestions = ["London, UK", "New York, US", "Tokyo, JP", "Paris, FR", "Sydney, AU"].filter((city) =>
    city.toLowerCase().includes(query.toLowerCase()),
  )

  if (suggestions.length > 0) {
    elements.searchSuggestions.innerHTML = suggestions
      .map((city) => `<div class="suggestion-item" onclick="selectSuggestion('${city}')">${city}</div>`)
      .join("")
    elements.searchSuggestions.style.display = "block"
  } else {
    elements.searchSuggestions.style.display = "none"
  }
}


function selectSuggestion(city) {
  elements.inputElement.value = city.split(",")[0]
  elements.searchSuggestions.style.display = "none"
  fetchWeatherData(city.split(",")[0])
}


function toggleUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit
    elements.unitBtns.forEach((btn) => btn.classList.remove("active"))
    document.querySelector(`[data-unit="${unit}"]`).classList.add("active")

    if (currentWeatherData) {
      updateWeatherUI(currentWeatherData)
    }
    if (forecastData) {
      updateForecastUI(forecastData)
    }
  }
}


function toggleTheme() {
  isDarkTheme = !isDarkTheme
  localStorage.setItem("darkTheme", isDarkTheme)

  if (isDarkTheme) {
    document.documentElement.setAttribute("data-theme", "dark")
  } else {
    document.documentElement.removeAttribute("data-theme")
  }


  elements.themeToggle.style.transform = "rotate(180deg)"
  setTimeout(() => {
    elements.themeToggle.style.transform = "rotate(0deg)"
  }, 300)
}


function getCurrentLocation() {
  if (navigator.geolocation) {
    showLoading()
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeatherByCoords(latitude, longitude)
      },
      (error) => {
        hideLoading()
        showError("Unable to get your location. Please allow location access.")
        console.error("Geolocation error:", error)
      },
    )
  } else {
    showError("Geolocation is not supported by your browser.")
  }
}


async function fetchWeatherData(city) {
  showLoading()

  try {
    const response = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${apiKey}`)

    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? "City not found. Please check the spelling and try again."
          : "Unable to fetch weather data",
      )
    }

    const data = await response.json()
    console.log("Weather data:", data)

    currentWeatherData = data
    localStorage.setItem("lastCity", city)

    updateWeatherUI(data)
    fetchForecastData(data.coord.lat, data.coord.lon)
    setWeatherBackground(data.weather[0].main)

    hideLoading()
    showSuccess("Weather data updated successfully!")
  } catch (error) {
    console.error("Error:", error)
    showError(error.message)
    hideLoading()
  }
}


async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)

    if (!response.ok) {
      throw new Error("Unable to fetch weather data for your location.")
    }

    const data = await response.json()
    currentWeatherData = data

    localStorage.setItem("lastCity", data.name)
    updateWeatherUI(data)
    fetchForecastData(lat, lon)
    setWeatherBackground(data.weather[0].main)

    hideLoading()
    showSuccess("Location weather loaded!")
  } catch (error) {
    console.error("Error fetching weather by coords:", error)
    showError(error.message)
    hideLoading()
  }
}


async function fetchForecastData(lat, lon) {
  try {
    const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)

    if (response.ok) {
      const data = await response.json()
      forecastData = data
      updateHourlyForecast(data)
      updateForecastUI(data)
      updateChart(data)
    }
  } catch (error) {
    console.error("Forecast error:", error)
  }
}


function updateWeatherUI(data) {

  elements.cityElement.textContent = `${data.name}, ${data.sys.country}`


  const tempValue = currentUnit === "celsius" ? Math.round(data.main.temp) : Math.round((data.main.temp * 9) / 5 + 32)
  elements.temperature.textContent = `${tempValue}°${currentUnit === "celsius" ? "C" : "F"}`


  const maxTemp =
    currentUnit === "celsius" ? Math.round(data.main.temp_max) : Math.round((data.main.temp_max * 9) / 5 + 32)
  const minTemp =
    currentUnit === "celsius" ? Math.round(data.main.temp_min) : Math.round((data.main.temp_min * 9) / 5 + 32)

  elements.tempMax.textContent = `${maxTemp}°`
  elements.tempMin.textContent = `${minTemp}°`


  const feelsLikeTemp =
    currentUnit === "celsius" ? Math.round(data.main.feels_like) : Math.round((data.main.feels_like * 9) / 5 + 32)
  elements.feelsLike.textContent = `Feels like ${feelsLikeTemp}°${currentUnit === "celsius" ? "C" : "F"}`


  elements.descriptionText.textContent = data.weather[0].description


  const iconName = getWeatherIconName(data.weather[0].main)
  elements.weatherIcon.textContent = iconName


  const windSpeedKmh = Math.round(data.wind.speed * 3.6)
  elements.windSpeed.textContent = `${windSpeedKmh} km/h`


  if (data.wind.deg !== undefined) {
    const direction = getWindDirection(data.wind.deg)
    elements.windDirection.textContent = direction
    elements.windArrow.style.transform = `rotate(${data.wind.deg}deg)`
  }


  elements.humidity.textContent = `${data.main.humidity}%`
  elements.humidityFill.style.width = `${data.main.humidity}%`


  const visibilityKm = (data.visibility / 1000).toFixed(1)
  elements.visibility.textContent = `${visibilityKm} km`
  const visibilityPercent = Math.min((data.visibility / 10000) * 100, 100)
  elements.visibilityLevel.style.width = `${visibilityPercent}%`


  elements.pressure.textContent = `${data.main.pressure} hPa`


  const sunrise = new Date(data.sys.sunrise * 1000)
  const sunset = new Date(data.sys.sunset * 1000)
  elements.sunrise.textContent = sunrise.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
  elements.sunset.textContent = sunset.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })


  updateFavoriteButton(data.name)


  updateDateTime()
}


function updateHourlyForecast(data) {
  elements.hourlyContainer.innerHTML = ""


  const hourlyData = data.list.slice(0, 8)

  hourlyData.forEach((item, index) => {
    const time = new Date(item.dt * 1000)
    const hour = time.getHours()
    const temp = currentUnit === "celsius" ? Math.round(item.main.temp) : Math.round((item.main.temp * 9) / 5 + 32)
    const icon = getWeatherIconName(item.weather[0].main)

    const hourlyItem = document.createElement("div")
    hourlyItem.className = "hourly-item"
    hourlyItem.style.animationDelay = `${index * 0.1}s`

    hourlyItem.innerHTML = `
            <div class="hourly-time">${hour === 0 ? "12 AM" : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}</div>
            <i class="material-icons hourly-icon">${icon}</i>
            <div class="hourly-temp">${temp}°</div>
        `

    elements.hourlyContainer.appendChild(hourlyItem)
  })
}


function updateForecastUI(data) {
  elements.forecastContainer.innerHTML = ""


  const dailyData = {}
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString()
    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        weather: item.weather[0],
        date: new Date(item.dt * 1000),
      }
    }
    dailyData[date].temps.push(item.main.temp)
  })

  const dailyForecasts = Object.values(dailyData).slice(0, 5)

  dailyForecasts.forEach((forecast, index) => {
    const day = forecast.date.toLocaleDateString("en-US", { weekday: "short" })
    const maxTemp =
      currentUnit === "celsius"
        ? Math.round(Math.max(...forecast.temps))
        : Math.round((Math.max(...forecast.temps) * 9) / 5 + 32)
    const minTemp =
      currentUnit === "celsius"
        ? Math.round(Math.min(...forecast.temps))
        : Math.round((Math.min(...forecast.temps) * 9) / 5 + 32)
    const icon = getWeatherIconName(forecast.weather.main)

    const forecastItem = document.createElement("div")
    forecastItem.className = "forecast-item"
    forecastItem.style.animationDelay = `${index * 0.1}s`

    forecastItem.innerHTML = `
            <div class="forecast-day">${day}</div>
            <div class="forecast-weather">
                <i class="material-icons forecast-icon">${icon}</i>
                <div class="forecast-desc">${forecast.weather.description}</div>
            </div>
            <div class="forecast-temps">
                <span class="forecast-high">${maxTemp}°</span>
                <span class="forecast-low">${minTemp}°</span>
            </div>
        `

    elements.forecastContainer.appendChild(forecastItem)
  })
}


function updateChart(data) {
  if (!elements.chartCanvas) return

  const ctx = elements.chartCanvas.getContext("2d")
  const activeTab = document.querySelector(".chart-tab.active").dataset.chart


  ctx.clearRect(0, 0, elements.chartCanvas.width, elements.chartCanvas.height)


  const chartData = data.list.slice(0, 8).map((item) => {
    switch (activeTab) {
      case "temperature":
        return currentUnit === "celsius" ? item.main.temp : (item.main.temp * 9) / 5 + 32
      case "humidity":
        return item.main.humidity
      case "pressure":
        return item.main.pressure
      default:
        return item.main.temp
    }
  })


  drawLineChart(ctx, chartData, activeTab)
}


function drawLineChart(ctx, data, type) {
  const canvas = ctx.canvas
  const padding = 40
  const width = canvas.width - padding * 2
  const height = canvas.height - padding * 2

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1


  ctx.strokeStyle = "#e0e0e0"
  ctx.lineWidth = 1

  for (let i = 0; i <= 4; i++) {
    const y = padding + (height / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(padding + width, y)
    ctx.stroke()
  }


  ctx.strokeStyle = "#74b9ff"
  ctx.lineWidth = 3
  ctx.beginPath()

  data.forEach((value, index) => {
    const x = padding + (width / (data.length - 1)) * index
    const y = padding + height - ((value - min) / range) * height

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()


  ctx.fillStyle = "#0984e3"
  data.forEach((value, index) => {
    const x = padding + (width / (data.length - 1)) * index
    const y = padding + height - ((value - min) / range) * height

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  })


  ctx.fillStyle = "#666"
  ctx.font = "12px Poppins"
  ctx.textAlign = "center"

  data.forEach((value, index) => {
    const x = padding + (width / (data.length - 1)) * index
    const label = `${Math.round(value)}`
    ctx.fillText(label, x, canvas.height - 10)
  })
}


function switchChart(chartType) {
  elements.chartTabs.forEach((tab) => tab.classList.remove("active"))
  document.querySelector(`[data-chart="${chartType}"]`).classList.add("active")

  if (forecastData) {
    updateChart(forecastData)
  }
}


function toggleFavoritesDropdown() {
  const isVisible = elements.favoritesDropdown.style.display === "block"
  elements.favoritesDropdown.style.display = isVisible ? "none" : "block"

  if (!isVisible) {
    updateFavoritesDisplay()
  }
}

function toggleCurrentCityFavorite() {
  if (!currentWeatherData) return

  const cityName = currentWeatherData.name
  const isFavorite = favorites.includes(cityName)

  if (isFavorite) {
    favorites = favorites.filter((city) => city !== cityName)
    elements.addFavorite.innerHTML = '<i class="material-icons">favorite_border</i>'
    elements.addFavorite.classList.remove("active")
  } else {
    favorites.push(cityName)
    elements.addFavorite.innerHTML = '<i class="material-icons">favorite</i>'
    elements.addFavorite.classList.add("active")
  }

  localStorage.setItem("weatherFavorites", JSON.stringify(favorites))
  updateFavoritesDisplay()
}

function updateFavoriteButton(cityName) {
  const isFavorite = favorites.includes(cityName)
  elements.addFavorite.innerHTML = `<i class="material-icons">${isFavorite ? "favorite" : "favorite_border"}</i>`
  elements.addFavorite.classList.toggle("active", isFavorite)
}

function updateFavoritesDisplay() {
  if (favorites.length === 0) {
    elements.favoritesList.style.display = "none"
    elements.noFavorites.style.display = "block"
  } else {
    elements.favoritesList.style.display = "grid"
    elements.noFavorites.style.display = "none"

    elements.favoritesList.innerHTML = favorites
      .map(
        (city) => `
            <div class="favorite-item" onclick="loadFavoriteCity('${city}')">
                <div>${city}</div>
                <button onclick="removeFavorite('${city}', event)" style="background: none; border: none; color: #e74c3c; cursor: pointer; margin-top: 5px;">
                    <i class="material-icons" style="font-size: 16px;">delete</i>
                </button>
            </div>
        `,
      )
      .join("")
  }
}

function loadFavoriteCity(city) {
  elements.favoritesDropdown.style.display = "none"
  fetchWeatherData(city)
}

function removeFavorite(city, event) {
  event.stopPropagation()
  favorites = favorites.filter((fav) => fav !== city)
  localStorage.setItem("weatherFavorites", JSON.stringify(favorites))
  updateFavoritesDisplay()


  if (currentWeatherData && currentWeatherData.name === city) {
    updateFavoriteButton(city)
  }
}


function getWeatherIconName(weatherCondition) {
  const iconMap = {
    Clear: "wb_sunny",
    Clouds: "cloud",
    Rain: "umbrella",
    Thunderstorm: "flash_on",
    Drizzle: "grain",
    Snow: "ac_unit",
    Mist: "cloud",
    Smoke: "cloud",
    Haze: "cloud",
    Fog: "cloud",
    Dust: "blur_on",
    Sand: "blur_on",
    Ash: "blur_on",
    Squall: "air",
    Tornado: "tornado",
  }

  return iconMap[weatherCondition] || "help"
}

function getWindDirection(degrees) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

function setWeatherBackground(weatherCondition) {
  document.body.classList.remove("clear", "clouds", "rain", "snow", "thunderstorm")

  const condition = weatherCondition.toLowerCase()

  if (condition === "clear") {
    document.body.classList.add("clear")
  } else if (condition === "clouds") {
    document.body.classList.add("clouds")
  } else if (condition === "rain" || condition === "drizzle") {
    document.body.classList.add("rain")
    createRainEffect()
  } else if (condition === "snow") {
    document.body.classList.add("snow")
    createSnowEffect()
  } else if (condition === "thunderstorm") {
    document.body.classList.add("thunderstorm")
  }
}

function createRainEffect() {

  document.querySelectorAll(".raindrop").forEach((drop) => drop.remove())

  for (let i = 0; i < 50; i++) {
    const raindrop = document.createElement("div")
    raindrop.className = "raindrop"
    raindrop.style.cssText = `
            position: fixed;
            width: 2px;
            height: 15px;
            background: rgba(116, 185, 255, 0.6);
            left: ${Math.random() * 100}%;
            animation: rainFall ${0.5 + Math.random() * 0.5}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
            z-index: 5;
            pointer-events: none;
        `
    document.body.appendChild(raindrop)
  }
}

function createSnowEffect() {

  document.querySelectorAll(".snowflake").forEach((flake) => flake.remove())

  for (let i = 0; i < 30; i++) {
    const snowflake = document.createElement("div")
    snowflake.className = "snowflake"
    snowflake.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            animation: snowFall ${2 + Math.random() * 3}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
            z-index: 5;
            pointer-events: none;
        `
    document.body.appendChild(snowflake)
  }
}

function createParticles() {
  const particlesContainer = document.querySelector(".particles-container")

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 6}s;
            animation-duration: ${4 + Math.random() * 4}s;
        `
    particlesContainer.appendChild(particle)
  }
}

function updateDateTime() {
  const now = new Date()
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  elements.date.textContent = now.toLocaleDateString("en-US", options)

  if (elements.localTime) {
    elements.localTime.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}


function showLoading() {
  elements.loadingContainer.style.display = "block"
  elements.errorMessage.style.display = "none"
  elements.successMessage.style.display = "none"
}

function hideLoading() {
  elements.loadingContainer.style.display = "none"
}

function showError(message) {
  elements.errorText.textContent = message
  elements.errorMessage.style.display = "flex"
  elements.successMessage.style.display = "none"
  hideLoading()


  setTimeout(() => {
    elements.errorMessage.style.display = "none"
  }, 5000)
}

function showSuccess(message) {
  elements.successMessage.querySelector("span").textContent = message
  elements.successMessage.style.display = "flex"
  elements.errorMessage.style.display = "none"


  setTimeout(() => {
    elements.successMessage.style.display = "none"
  }, 3000)
}


const weatherStyles = document.createElement("style")
weatherStyles.textContent = `
    @keyframes rainFall {
        to {
            transform: translateY(100vh);
        }
    }
    
    @keyframes snowFall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
    
    .raindrop {
        opacity: 0.7;
    }
    
    .snowflake {
        opacity: 0.8;
    }
`
document.head.appendChild(weatherStyles)
