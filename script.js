const form = document.querySelector('.top-banner form');
const list = document.querySelector('ul');
const msg = document.querySelector('.msg');
const cityInput = document.getElementById('city-input');

const apiKey = config.apiKey;
const stateCode = '';
const limit = '1';
const part = 'minutely,hourly,alerts,daily';

// "Please note that using One Call 3.0 requires a separate subscription to the
// One Call by Call plan. Learn more here https://openweathermap.org/price.
// If you have a valid subscription to the One Call by Call plan, but still receive this error,
// then please see https://openweathermap.org/faq#error401 for more info."

async function getCoordinates(city, country) {
	const urlCoordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateCode},${country}&limit=${limit}&appid=${apiKey}`;

	try {
		const response = await fetch(urlCoordinates);
		const parsedResponse = await response.json();
		return parsedResponse;
	} catch (error) {
		console.log(error);
	}
}

// https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${apiKey}

// https://api.openweathermap.org/data/3.0/onecall/overview?lat=${lat}&lon=${lon}&appid=${apiKey}

async function getWeather(lat, lon) {
	const urlWeather = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=${part}&appid=${apiKey}`;

	try {
		const response = await fetch(urlWeather);

		if (!response.ok) {
			throw new Error(
				`API error: ${response.status} ${response.statusText}`
			);
		}

		const parsedResponse = await response.json();
		return parsedResponse;
	} catch (error) {
		console.log(error.message);
		return null;
	}
}

// const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const city = document.getElementById('city-input').value.trim();
	const country = document.getElementById('country-input').value.trim();

	const result = await getCoordinates(city, country);
	const lat = result[0].lat;
	const lon = result[0].lon;
	console.log(lat, lon);

	const weatherData = await getWeather(lat, lon);
	console.log(weatherData);

	const { current } = weatherData;
	const icon = `https://openweathermap.org/img/wn/${current.weather[0]['icon']}@2x.png`;
	console.log(current.temp);
	const li = document.createElement('li');
	li.classList.add('city');
	const markup = `
	    <h2 class="city-name" data-temp="${city}">
            <span>${city}</span> 
            <sup>${country}</sup>
        </h2>
        <div class="city-temp">
            ${Math.round(current.temp)}<sup>°C</sup> 
        </div> 
        <figure>
            <img class="city-icon" src=${icon} alt=${
		current.weather[0]['main']
	}>
            <figcaption>${current.weather[0]['description']}</figcaption>
        </figure>
    `;

	li.innerHTML = markup;
	list.appendChild(li);
	msg.textContent = '';
	form.reset();
	cityInput.focus();
});
