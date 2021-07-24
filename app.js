window.addEventListener('load', () => {
    // default to London
    getWeather(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=0d6afa8297ae7c499b10e6632078338e&units=metric`)

    /**
     * Selectors
     */
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description')
    let temperatureDegree = document.querySelector('.temperature-degree')
    let locationTimezone = document.querySelector('.location-timezone')
    let weatherIcon = document.querySelector('.icon')
    let degreeSection = document.querySelector('.degree-section')
    const temperatureSpan = document.querySelector('.temperature span')
    const currentLocationButton = document.querySelector('.current-location-button')
    const searchButton = document.querySelector('.search-button')
    const locationInput = document.querySelector('.location-input')
    const locationForm = document.querySelector('.location-form')

    /**
     * Event Listeners
     */
    currentLocationButton.addEventListener('click', getPosition)
    searchButton.addEventListener('click', setLocation)
    locationInput.addEventListener('input', enableSearchButton)

    /**
     * Functions
     */


    /**
     * Enables the search button when some text has been entered in the input field
     */
    function enableSearchButton() {
        if (locationInput !== "") {
            searchButton.removeAttribute('disabled')
        }
    }

    /**
     * Takes the input field entry and gets the weather
     */
    function setLocation(event) {
        event.preventDefault()

        const location = locationInput.value
        const api = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=0d6afa8297ae7c499b10e6632078338e&units=metric`
        getWeather(api)
    }

    /**
     * Accesses user's geo location and gets the weather  
     */
    function getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( position => {
                long = position.coords.longitude;
                lat = position.coords.latitude;
    
                const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=0d6afa8297ae7c499b10e6632078338e&units=metric`
    
                getWeather(api)
            })
        }
    }

    /**
     * Gets the weather for a given location
     * @param  {String} api The weather API
     */
    function getWeather(api) {
        fetch(api)
            .then(response => {
                // no location detected
                if (response.status === 400) {
                    // set validation
                    locationForm.classList.add('invalid')
                    locationInput.setAttribute('placeholder', 'Please enter a location')
                } 
                // location not found
                else if (response.status === 404) {
                    // set validation
                    locationInput.value = ''
                    locationForm.classList.add('invalid')
                    locationInput.setAttribute('placeholder', 'The location name is not valid')
                }
                else if (response.status === 200) {
                    locationForm.classList.remove('invalid')
                    return response.json()
                }
            })
            .then(data => {
                const { temp } = data.main
                const {description: summary, icon: iconCode, main} = data.weather[0]
                const location = data.name
                // Set DOM elements from the API
                temperatureDegree.textContent = temp;
                temperatureDescription.textContent = capitalizeFirstLetter(summary);
                locationTimezone.textContent = location
                
                // Formula for Fahrenheit
                // (0°C × 9/5) + 32 = 32°F
                const tempFahrenheit = (temp * (9/5) + 32).toFixed(2)

                // Create icon
                weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`
                weatherIcon.alt = main

                // Change temperature to Celsius/Fahrenheit
                degreeSection.addEventListener('click', () => {
                    if (temperatureSpan.textContent === "F") {
                        temperatureSpan.textContent = "C"
                        temperatureDegree.textContent = temp;
                    } else {
                        temperatureSpan.textContent = "F"
                        temperatureDegree.textContent = tempFahrenheit;
                    }
                })
            })
    }

    /**
     * Capitalizes the first letter of a given text
     * @param  {String} text The lower-cased text
     * @return {String}      The capitalized text
     */
    function capitalizeFirstLetter(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
})