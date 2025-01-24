import './App.css'
import MapComponent from './components/MapComponent.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import CenterToLocationButton from "./components/CenterToLocationButton.jsx";
import {useSelector} from "react-redux";


function App() {
    // Get error from the store
    const error = useSelector((state) => state.weather.error);

    return (
        <>
            <MapComponent/>
            <FilterPanel/>
            <CenterToLocationButton />
            {error && <div className="error">{error}</div>}

        </>
    )
}

export default App
