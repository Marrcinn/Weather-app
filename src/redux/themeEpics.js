import { ofType } from 'redux-observable';
import { tap, mapTo } from 'rxjs/operators';
import { toggleTheme, setTheme } from './themeSlice';

// This epic seems not to work, probably because we are on localhost without https
const persistThemeEpic = (action$) =>
    action$.pipe(
        ofType(toggleTheme, setTheme), // Listen for theme change actions
        tap((action) => {
            localStorage.setItem('theme', action.payload || (action.type === 'theme/toggleTheme' ? (action.payload === 'dark' ? 'light' : 'dark') : action.payload) || 'light'); // Save to local storage
        }),
        mapTo(null) // Don't emit any further actions
    );

const loadThemeEpic = () => {
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || 'light'; // Default to light if no saved theme
    return [setTheme(initialTheme)];
}

export const themeEpics = [persistThemeEpic, loadThemeEpic];
