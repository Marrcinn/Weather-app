import {configureStore} from '@reduxjs/toolkit';
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import weatherReducer from './weatherSlice'; // Import your slice
import {
    fetchCitiesEpic,
    refreshWeatherEpic,
    updateTopCitiesAndFiltersEpic,
    updateWeatherEpic,
    fetchUserLocationEpic,
}
    from './weatherEpics'; // Import your epics

const rootEpic = combineEpics(
    fetchCitiesEpic,
    updateTopCitiesAndFiltersEpic,
    updateWeatherEpic,
    refreshWeatherEpic,
    fetchUserLocationEpic,
);

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
    reducer: {
        weather: weatherReducer, // Add your reducer here
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic); // Run the combined epics

export default store;
