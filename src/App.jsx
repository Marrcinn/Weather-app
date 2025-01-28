import './App.css'
import MapComponent from './components/MapComponent.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import CenterToLocationButton from "./components/CenterToLocationButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import {toggleTheme} from "./redux/themeSlice.js";
import styled, {ThemeProvider} from "styled-components";

const lightTheme = {
    body: '#fff',
    text: '#333',
    buttonBackground: 'lightgray',
};

const darkTheme = {
    body: '#333',
    text: '#eee',
    buttonBackground: 'darkgray',
};

const AppContainer = styled.div`
    width: 100vw;  // Use viewport units for width and height
    height: 100vh;
    margin: 0;
    padding: 0;
    display: flex; // Use flexbox for layout (optional, but often useful)
    flex-direction: column; // Or row, depending on your layout needs
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
`;


function App() {
    // Get error from the store
    const themeMode = useSelector((state) => state.theme.mode);
    const dispatch = useDispatch();
    const theme = themeMode === 'light' ? lightTheme : darkTheme;

    const handleThemeChange = () => {
        dispatch(toggleTheme());
    }

    return (
        <ThemeProvider theme={theme}>
            <AppContainer className={themeMode}>
                <MapComponent/>
                <FilterPanel/>
                <CenterToLocationButton />
                <button onClick={handleThemeChange}>Change Theme</button>
            </AppContainer>
        </ThemeProvider>
    )
}

export default App
