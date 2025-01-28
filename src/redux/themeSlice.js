import { createSlice } from '@reduxjs/toolkit';

const  initialState = {
    mode: 'light', // Default theme
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state, action) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            console.log("Changed theme to "+state.mode);
        },
        setTheme: (state, action) => {
            state.mode = action.payload;
        },
    },
});

export const {
    toggleTheme,
    setTheme
} = themeSlice.actions;
export default themeSlice.reducer;