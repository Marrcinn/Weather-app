import {ofType} from 'redux-observable';
import {from, of, interval, merge} from 'rxjs';
import {catchError, debounceTime, map, switchMap, startWith,} from 'rxjs/operators';
import {
    setError,
    setLoading,
    setCities,
    setTopCitiesWithFilters,
    setUserLocation,
    setFilterPopulation,
    setCitiesWithWeather,
} from './weatherSlice';
import api from '../services/api';

const SET_MAP_BOUNDS = 'weather/setMapBounds'; // Use the action type string
const SET_TOP_CITIES_WITH_FILTER = 'weather/setTopCitiesWithFilters';
const SET_CITIES = 'weather/setCities';
const SET_FILTER_NAME = 'weather/setFilterName';
const FETCH_USER_LOCATION = 'weather/fetchUserLocation';
const SET_FILTER_POPULATION = 'weather/setFilterPopulation';

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
            const {cities, filterName} = state$.value.weather;
            if (!cities || cities.length === 0) {
                return of(setLoading(false));
            }
            let nameFilteredCities = cities;
            if (filterName) {
                nameFilteredCities = nameFilteredCities.filter(city => city.name.toLowerCase().startsWith(filterName.toLowerCase()));
            }
            // Update filterPopulation with the min and max population of the top cities
            const minPopulation = nameFilteredCities.length > 0 ? Math.min(...nameFilteredCities.map(city => city.population)) : 0;
            const maxPopulation = nameFilteredCities.length > 0 ? Math.max(...nameFilteredCities.map(city => city.population)) : 0;
            const filterPopulation = {min: minPopulation, max: maxPopulation};
            return merge(of(setFilterPopulation(filterPopulation)));
        })
    );

};

export const updateFilteredCitiesEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SET_FILTER_POPULATION),
        debounceTime(1000),
        switchMap(() => {
            const {cities, filterPopulation, mapBounds, filterName} = state$.value.weather;
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
            // Filter by population
            console.log("Filtering by population", filterPopulation);
            topCities = topCities.filter(city => city.population >= filterPopulation.min && city.population <= filterPopulation.max);
            // Sort and slice
            topCities = topCities.sort((a, b) => b.population - a.population).slice(0, 20);
            console.log("Top cities with filters", topCities);

            return of(setTopCitiesWithFilters(topCities));
        })
    );
}

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

export const refreshWeatherEpic = (action$, state$) => {
    return interval(60 * 60 * 1000).pipe(
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


export const fetchUserLocationEpic = (action$, state$) => {
    return action$
        .pipe(
            ofType(FETCH_USER_LOCATION),
            startWith(0),
            switchMap(() => {
                const {mapBounds} = state$.value.weather;
                let user_location =null
                if (!mapBounds || !mapBounds.southwest || !mapBounds.northeast) {
                    user_location = {lat: 52.2, lng: 21};
                }
                else{
                    user_location = {
                        lat: (mapBounds.southwest.lat + mapBounds.northeast.lat) / 2,
                        lng: (mapBounds.southwest.lng+ mapBounds.northeast.lng) / 2};
                }
                return from(api.fetchUserLocation()).pipe(
                    map((location) => setUserLocation(location)),
                    catchError(error => {
                        console.log(error);
                        // Return an action to set the error state and setUserLocation to current location
                        return of(setError(error), setUserLocation(user_location));


                    })
                );
            })
        );
};


