import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    // Cities are all the cities fetched from the API so far. City has attributes id, name, lat, lon, population, weather.
    // weather starts out as null and is updated when the weather is fetched.
    cities: [],
    // Top cities are top 20 cities based on the filters.
    topCities: [],
    // Loading is a boolean to indicate if the app is currently loading data.
    loading: false,
    // Map bounds is an object with southwest and northeast properties, each with lat and lng properties.
    mapBounds: null,
    // Filter name is a string to filter cities by name (they must start with the filter name (case insensitive)).
    filterName: '',
    // Filter population is an object with min and max properties to filter cities by
    filterPopulation: {min: 0, max: 10000000}, // Initialize max to null
    // availablePopulationRange is the range the slider should be from/to
    availablePopulationRange: {min: 0, max: 10000000}, // Initialize max to null
    // User location is an object with lat and lng properties to center the map on the user's location.
    // The map will center to user's location unless it is null
    userLocation: null,
    theme: 'light', // Default theme
    // An error object to store any errors during API calls
    error: null, // To store any errors during API calls
};

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setCities: (state, action) => {
            console.log("Set cities");
            for (let city of action.payload) {
                let existingCity = state.cities.find(c => c.id === city.id);
                if (!existingCity) {
                    state.cities.push(city);
                }
            }
            const min_population = Math.min(...state.cities.map(city => city.population));
            const max_population = Math.max(...state.cities.map(city => city.population));
            state.availablePopulationRange = {min: min_population, max: max_population};
        },
        // Set the top cities with filters
        setTopCitiesWithFilters: (state, action) => {
            console.log("Set top cities with filters");
            state.topCities = action.payload;
        },
        // Set the Top cities with weather.
        setCitiesWithWeather: (state, action) => {
            console.log("Set weather for the city");
            for (let city of action.payload) {
                let existingCity = state.cities.find(c => c.id === city.id);
                if (existingCity) {
                    existingCity.weather = city.weather;
                }
            }
            state.topCities = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setMapBounds: (state, action) => {
            state.userLocation = null;
            console.log("Set map bounds");
            state.mapBounds = action.payload;
        },
        setFilterName: (state, action) => {
            console.log("Set filter name");
            state.filterName = action.payload;
        },
        setFilterPopulation: (state, action) => {
            console.log("Set filter population", action.payload);
            state.filterPopulation = action.payload;
        },
        fetchUserLocation: (state) => {
            console.log("Fetch user location");
            state.loading = true;
        },
        setUserLocation: (state, action) => {
            console.log("Set user location");
            console.log(action.payload);
            state.userLocation = action.payload;
        },
        deleteUserLocation: (state) => {
            console.log("Delete user location");
            state.userLocation = null;
            state.loading = false;
        },

        setError: (state, action) => {
            console.log("Set error", action.payload);
            state.loading = false;
            state.error = action.payload;
        },
        clearError: (state) => {
           console.log("clear Error");
           state.error = null;
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
    setCitiesWithWeather,
    fetchUserLocation,
    deleteUserLocation,
    clearError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
