import {ofType} from 'redux-observable';
import {from, of, interval, forkJoin, merge} from 'rxjs';
import {catchError, debounceTime, map, switchMap, startWith,} from 'rxjs/operators';
import {
    setError,
    setLoading,
    setCities,
    setTopCitiesWithFilters,
    setUserLocation,
    setFilterName,
    setFilterPopulation,
    setMapBounds, setCitiesWithWeather,
    fetchUserLocation,
    deleteUserLocation
} from './weatherSlice';
import api from '../services/api';

const SET_MAP_BOUNDS = 'weather/setMapBounds'; // Use the action type string
const SET_TOP_CITIES_WITH_FILTER = 'weather/setTopCitiesWithFilters';
const SET_CITIES = 'weather/setCities';
const SET_FILTER_NAME = 'weather/setFilterName';
const SET_USER_LOCATION = 'weather/setUserLocation';
const FETCH_USER_LOCATION = 'weather/fetchUserLocation';

export const fetchCitiesEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SET_MAP_BOUNDS),
        debounceTime(1000),
        switchMap(() => {
            const {mapBounds} = state$.value.weather;
            if (!mapBounds || !mapBounds.southwest || !mapBounds.northeast) {
                return of(setLoading(false));
            }
            return from(api.fetchCities(mapBounds)).pipe(
                map((cities) => setCities(cities)),
                catchError(error => of(setError(error.message)))
            );
        })
    );
}

export const updateTopCitiesAndFiltersEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SET_CITIES, SET_FILTER_NAME),
        debounceTime(1000),
        switchMap(() => {
            const {cities, filterName, mapBounds} = state$.value.weather;
            if (!cities || cities.length === 0) {
                return of(setLoading(false));
            }
            let topCities = cities;
            if (filterName) {
                topCities = topCities.filter(city => city.name.toLowerCase().startsWith(filterName.toLowerCase()));
            }
            if (mapBounds && mapBounds.southwest && mapBounds.northeast) {
                topCities = topCities.filter(city => city.lat >= mapBounds.southwest.lat &&
                    city.lat <= mapBounds.northeast.lat &&
                    city.lon >= mapBounds.southwest.lng &&
                    city.lon <= mapBounds.northeast.lng);
            }
            // Sort and slice
            topCities = topCities.sort((a, b) => b.population - a.population).slice(0, 20);
            console.log("Top cities", topCities);
            // Update filterPopulation with the min and max population of the top cities
            const minPopulation = topCities.length > 0 ? Math.min(...topCities.map(city => city.population)) : 0;
            const maxPopulation = topCities.length > 0 ? Math.max(...topCities.map(city => city.population)) : 0;
            const filterPopulation = {min: minPopulation, max: maxPopulation};
            return merge(of(setFilterPopulation(filterPopulation)), of(setTopCitiesWithFilters(topCities)));
        })
    );

};

// Get weather for the top cities. If the city already has weather, skip it.
export const updateWeatherEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SET_TOP_CITIES_WITH_FILTER),
        debounceTime(1000),
        switchMap(() => {
            const {topCities} = state$.value.weather;
            if (!topCities || topCities.length === 0) {
                return of(setLoading(false));
            }
            const weatherPromises = topCities.map(city => {
                if (!city.weather) {
                    console.log("Fetching weather for city", city);
                    return api.fetchWeather(city).then(weather => ({
                        ...city,
                        weather
                    }));
                } else {
                    return Promise.resolve(city);
                }
            });

            return from(Promise.all(weatherPromises)).pipe(
                map(citiesWithWeather => setCitiesWithWeather(citiesWithWeather)),
                catchError(error => of(setError(error.message)))
            );
        })
    );
};

// TODO: Refresh each hour by removing the weather from the cities
export const refreshWeatherEpic = (action$, state$) => {
    return interval(60*60 * 1000).pipe(
        startWith(0),
        map(() => {
            const {cities} = state$.value.weather;
            if (!cities || cities.length === 0) {
                return setLoading(false);
            }
            return setCities(cities.map(city => ({...city, weather: null})));
        })
    );
}


const WARSAW_COORDINATES = {lat: 20.2297, lng: 21.0122}; // Warsaw coordinates


export const fetchUserLocationEpic = (action$) => {
    // Only once, when the app starts
    return action$
        .pipe(
        ofType(FETCH_USER_LOCATION),
        startWith(0),
        switchMap(() => {
            return from(api.fetchUserLocation()).pipe(
                map((location) => setUserLocation(location)),
                catchError(error =>{console.log(error); return of(setError(error.message))})
            );
        })
    );
};


