import {configureStore} from '@reduxjs/toolkit';
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import weatherReducer from './weatherSlice';
import themeReducer from './themeSlice';
import {
    fetchCitiesEpic,
    refreshWeatherEpic,
    updateTopCitiesAndFiltersEpic,
    updateWeatherEpic,
    fetchUserLocationEpic,
    updateFilteredCitiesEpic,
}
    from './weatherEpics'; // Import your epics
import {themeEpics} from './themeEpics'; // Import your theme epics

const rootEpic = combineEpics(
    fetchCitiesEpic,
    updateTopCitiesAndFiltersEpic,
    updateWeatherEpic,
    refreshWeatherEpic,
    fetchUserLocationEpic,
    updateFilteredCitiesEpic,
    ...themeEpics
);

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
    reducer: {
        weather: weatherReducer,
        theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic); // Run the combined epics

export default store;
