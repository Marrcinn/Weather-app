import {ofType} from 'redux-observable';
import {from, of, interval, merge} from 'rxjs';
import {catchError, debounceTime, map, switchMap, startWith,} from 'rxjs/operators';
import {
    setError,
    setLoading,
    setCities,
    setVisibleCities,
    setFilterPopulation,
    setAvailablePopulationRange,
    setTopCitiesWithFilters,
    updateCityWeather,
    setUserLocation,
} from './weatherSlice';
import api from '../services/api';

const SET_MAP_BOUNDS = 'weather/setMapBounds'; // Use the action type string
const SET_CITIES = 'weather/setCities';
const SET_VISIBLE_CITIES = 'weather/setVisibleCities';
const SET_FILTER_NAME = 'weather/setFilterName';
const SET_FILTER_POPULATION = 'weather/setFilterPopulation';

export const fetchCitiesEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SET_MAP_BOUNDS),
        debounceTime(1000),
        switchMap(() => {
            const {mapBounds, cities} = state$.value.weather;
            if (!mapBounds || !mapBounds.southwest || !mapBounds.northeast) {
                return of(setLoading(false));
            }
            return from(api.fetchCities(mapBounds)).pipe(
                map((fetched_cities) => {
                    let mergedCities = cities ? [...cities] : [];
                    for (let new_city of fetched_cities){
                        if (!mergedCities.find(city => city.id === new_city.id)){
                            // Add it with weather attribute set to null
                            mergedCities.push(new_city);
                        }
                    }
                    return setCities(mergedCities);
                }),
                catchError(error => of(setError(error)))
            );
        })
    );
}

export const setVisibleCitiesEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SET_CITIES),
        debounceTime(1000),
        switchMap(() => {
            const {cities, mapBounds} = state$.value.weather;
            if (!cities || cities.length === 0) {
                return of(setLoading(false));
            }
            let visibleCities = cities;
            if (mapBounds && mapBounds.southwest && mapBounds.northeast) {
                visibleCities = cities.filter(city =>
                    city.lat >= mapBounds.southwest.lat &&
                    city.lat <= mapBounds.northeast.lat &&
                    city.lon >= mapBounds.southwest.lng &&
                    city.lon <= mapBounds.northeast.lng);
            }
            // Adjust the filterPopulation and availablePopulationRange to the new visible cities
            const minPopulation = visibleCities.length > 0 ? Math.min(...visibleCities.map(city => city.population)) : 0;
            const maxPopulation = visibleCities.length > 0 ? Math.max(...visibleCities.map(city => city.population)) : 50000000;
            return merge(
                of(setVisibleCities(visibleCities)),
                of(setFilterPopulation({min: minPopulation, max: maxPopulation})),
                of(setAvailablePopulationRange({min: minPopulation, max: maxPopulation}))
            );
        })
    );
}

export const updateTopCitiesAndFiltersEpic = (action$, state$) => {
    return action$.pipe(
        ofType(SET_VISIBLE_CITIES, SET_FILTER_NAME, SET_FILTER_POPULATION),
        debounceTime(1000),
        switchMap(() => {
            const {visibleCities, filterName, filterPopulation, cities} = state$.value.weather;
            if (!visibleCities || visibleCities.length === 0) {
                return merge(
                    of(setTopCitiesWithFilters([])),
                    of(setLoading(false)),
                );
            }
            let topCities = visibleCities;
            if (filterName) {
                topCities = topCities.filter(city => city.name.toLowerCase().startsWith(filterName.toLowerCase()));
            }
            // Filter by population
            topCities = topCities.filter(city => city.population >= filterPopulation.min && city.population <= filterPopulation.max);
            // Sort and slice
            topCities = topCities.sort((a, b) => b.population - a.population).slice(0, 20);
            // Fetch weather for the top cities
            const weatherPromises = topCities.map(city => api.fetchWeather(city));

            return merge(from(Promise.all(weatherPromises)).pipe(
                map((weathers) => {
                    return setTopCitiesWithFilters(topCities.map((city, index) => ({...city, weather: weathers[index]})));
                }),
                catchError(error => of(setError(error.message)))
            ),
                of(setLoading(false)),
                // Using updateCityWeather to update the weather of the cities in the cities array
                of(...topCities.map(city => updateCityWeather(city)))
                );
        })
    );
};

export const refreshWeatherEpic = (action$, state$) => {
    const refresh_time = 60 * 60 * 1000; // 1 hour (for production)
    // const refresh_time = 30 * 1000; // 30 seconds (for testing)
    return interval(refresh_time).pipe(
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
export const updateUserLocationEpic = () => {
    const refreshTime = 5000; // Consistent naming

    return interval(refreshTime).pipe(
        switchMap(() => { // Use switchMap to cancel previous requests

            return from(api.fetchUserLocation()).pipe(
                map((location) => setUserLocation(location)),
                catchError(error => {
                    // Return an action to set the error state and setUserLocation to current location
                    return of(setUserLocation({error: error}));
                })
            );

        })
    );
};
