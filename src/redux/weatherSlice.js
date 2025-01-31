import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    // cities: all the cities fetched from the API so far. City has attributes id, name, lat, lon, population, weather.
    // weather starts out as null and is updated when the weather is fetched.
    cities: [],

    // visibleCities: a list of all cities that are in current mapBounds
    visibleCities: [],

    // topCities: top 20 cities based on the filters.
    topCities: [],
    // Loading is a boolean to indicate if the app is currently loading data.
    loading: false,
    // Map bounds is an object with southwest and northeast properties, each with lat and lng properties.
    mapBounds: null,
    // Filter name is a string to filter cities by name (they must start with the filter name (case insensitive)).
    filterName: '',
    // Filter population is an object with min and max properties to filter cities by
    filterPopulation: {min: 0, max: 50000000},
    // availablePopulationRange is the range the slider should be from/to
    availablePopulationRange: {min: 0, max: 50000000},
    // User location is an object with lat and lng properties to center the map on the user's location.
    // The map will center to user's location unless it is null
    userLocation: null,

    requestedMapLocation: null,
    // An error object to store any errors during API calls
    error: null, // To store any errors during API calls
};

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setCities: (state, action) => {
            state.cities = action.payload;
        },

        setVisibleCities: (state, action) => {
            state.visibleCities = action.payload;
        },
        updateCityWeather: (state, action) => {
            const city = action.payload;
            state.cities.map((c) => {
                if (c.id === city.id) {
                    c.weather = city.weather;
                }
                return c;
            });
        },

        // Set the top cities with filters
        setTopCitiesWithFilters: (state, action) => {
            state.topCities = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setMapBounds: (state, action) => {
            state.mapBounds = action.payload;
        },
        setFilterName: (state, action) => {
            state.filterName = action.payload;
        },
        setFilterPopulation: (state, action) => {
            state.filterPopulation = action.payload;
        },
        setAvailablePopulationRange: (state, action) => {
            state.availablePopulationRange = action.payload;
        },
        fetchUserLocation: (state) => {
            state.loading = true;
        },
        setUserLocation: (state, action) => {
            state.userLocation = action.payload;
        },

        setError: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        clearError: (state) => {
            state.error = null;
        },
        setMapToUserLocation: (state) => {
            state.requestedMapLocation = state.userLocation;
        },
        clearRequestedMapLocation: (state) => {
            state.requestedMapLocation = null;
        }
    },
});

export const {
    setCities,
    setTopCitiesWithFilters,
    setLoading,
    setMapBounds,
    setFilterName,
    setFilterPopulation,
    setUserLocation,
    setError,
    fetchUserLocation,
    clearError,
    setVisibleCities,
    setAvailablePopulationRange,
    updateCityWeather,
    setMapToUserLocation,
    clearRequestedMapLocation
} = weatherSlice.actions;

export default weatherSlice.reducer;
