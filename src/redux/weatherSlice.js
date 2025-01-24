import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    cities: [],
    topCities: [],
    loading: false,
    mapBounds: null,
    filterName: '',
    filterPopulation: {min: 0, max: 10000000}, // Initialize max to null
    availablePopulationRange: {min: 0, max: 10000000}, // Initialize max to null
    userLocation: null,
    theme: 'light', // Default theme
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
            state.error = null;
            const min_population = Math.min(...state.cities.map(city => city.population));
            const max_population = Math.max(...state.cities.map(city => city.population));
            state.availablePopulationRange = {min: min_population, max: max_population};
        },
        // Set the top cities with filters
        setTopCitiesWithFilters: (state, action) => {
            console.log("Set top cities with filters");
            state.topCities = action.payload;
            state.error = null;
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
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
            state.error = null;
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
        //setAvailablePopulationRange: (state, action) => {
        //    console.log("Set available population range");
        //    state.availablePopulationRange = action.payload;
        //},
        fetchUserLocation: (state) => {
            console.log("Fetch user location");
            state.loading = true;
            state.error = null;
        },
        setUserLocation: (state, action) => {
            console.log("Set user location");
            console.log(action.payload);
            state.userLocation = action.payload;
            state.error = null;
        },
        deleteUserLocation: (state) => {
            console.log("Delete user location");
            state.userLocation = null;
        },
        //toggleTheme: (state) => {
        //    console.log("Toggle theme");
        //    state.theme = state.theme === 'light' ? 'dark' : 'light';
        //},
        setError: (state, action) => {
            console.log("Set error");
            state.loading = false;
            state.error = action.payload;
        },
        //clearError: (state) => {
        //    console.log("clear Error");
        //    state.error = null;
        //}
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
} = weatherSlice.actions;

export default weatherSlice.reducer;
