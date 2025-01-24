import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import api from './services/api';
import MapComponent from './components/MapComponent.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import CenterToLocationButton from "./components/CenterToLocationButton.jsx";

import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'


function App() {
    const [count, setCount] = useState(0)
    return (
        <>
            <MapComponent/>
            <FilterPanel/>
            <CenterToLocationButton />
        </>
    )
}

export default App
