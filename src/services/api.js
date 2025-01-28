import axios from 'axios'

const OVERPASS_API_URL = "https://overpass.private.coffee/api/interpreter"
const WEATHER_API_BASE_URL = "http://api.weatherapi.com/v1"


const WEATHER_API_KEY = import.meta.env.VITE_API_KEY;


const api = {
    // fetchCities: fetch cities in bounds
    // bounds: object with southwest and northeast objects with lat and lng properties
    // returns a promise with the cities
    fetchCities(bounds) {
        if (!bounds || !bounds.southwest || !bounds.northeast) {
            return Promise.reject(new Error('Invalid bounds'))
        }

        let overpassQuery = `
			[out:json];
			(
				node["place"="city"]
				(${bounds.southwest.lat},${bounds.southwest.lng},${bounds.northeast.lat},${bounds.northeast.lng});
			);
			out center;
		`;
        console.log(overpassQuery);
        return axios.post(OVERPASS_API_URL, `data=${encodeURIComponent(overpassQuery)}`)
            .then(response => {
                if (!response.data || !response.data.elements) {
                    throw new Error('Invalid response');
                }
                let cities = response.data.elements.map(element => ({
                    id: element.id,
                    name: element.tags?.name || 'Unknown',
                    lat: element.lat,
                    lon: element.lon,
                    population: parseInt(element.tags?.population || 0),
                    weather: null,
                })).filter(city => city.lat && city.lon);
                return cities.sort((a, b) => b.population - a.population);

            })
            .catch(error => {
                console.error('Error fetching cities', error);
                throw error;
            });
    },
    // For a given city (object with .lat and .lon properties), fetch the current weather
    fetchWeather(city) {
        if (!city || !city.lat || !city.lon) {
            return Promise.reject(new Error('Invalid city data'));
        }
        const params = {
            q: `${city.lat},${city.lon}`,
            key: WEATHER_API_KEY,
        };

        return axios.get(WEATHER_API_BASE_URL + "/current.json", {params})
            .then(response => {
                if (!response.data) {
                    throw new Error('Invalid response');
                }
                console.log(response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching weather', error);
                throw error;
            });

    },
    // fetchUserLocation: fetch the user's location using the browser's geolocation API. Returns a promise with the location
	fetchUserLocation() {
        // Since this is only dev enviroment and is not server over https, the geolocation API will not work
        // To show how it should work, we will use a default (Warsaw) location, unless the user has denied the permission
		const default_warsaw = {
			lat: 52.22977,
			lng: 21.01178,
		};
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				resolve(default_warsaw)
			}
			navigator.geolocation.getCurrentPosition(
				position => {
					resolve({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				error => {
                    console.log(error.code);
                    if (error.code == 1) {
                        reject('User denied geolocation permission');
                        return;
                    }
                    console.error('Error getting user location', error);
					resolve(default_warsaw);
				}
			);
		});
	}
};
export default api;
