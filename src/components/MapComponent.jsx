import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import {
    setMapBounds,
    setLoading,
    fetchUserLocation,
    deleteUserLocation,
    clearError
} from '../redux/weatherSlice';
import WeatherMarker from './WeatherMarker';
import LoadingSpinner from './LoadingSpinner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
    const dispatch = useDispatch();
    const { topCities, loading, userLocation, error } = useSelector((state) => state.weather);
    const [mapCenter] = useState([52.2, 21]);

    function MapEvents() {
        const map = useMap();

        useEffect(() => {
            if (userLocation) {
                map.setView([userLocation.lat, userLocation.lng], map.getZoom());
                dispatch(deleteUserLocation());
            }
        }, [userLocation, map, dispatch]);

        useEffect(() => {
            const handleMoveEnd = () => {
                const bounds = map.getBounds();
                dispatch(setLoading({ loading: true }));
                dispatch(setMapBounds({
                    southwest: {
                        lat: bounds.getSouthWest().lat,
                        lng: bounds.getSouthWest().lng
                    },
                    northeast: {
                        lat: bounds.getNorthEast().lat,
                        lng: bounds.getNorthEast().lng
                    },
                }));
            };

            map.on('moveend', handleMoveEnd);
            return () => {
                map.off('moveend', handleMoveEnd);
            };
        }, [map, dispatch]);

        return null;
    }

    useEffect(() => {
        dispatch(fetchUserLocation());
    }, [dispatch]);

    return (
        <div style={{ height: '550px', width: '100%' }}> {/* Set map dimensions */}
            <MapContainer center={mapCenter} zoom={10} style={{ height: '90%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents />
                {topCities.map((city) => (
                    <WeatherMarker key={city.id} city={city} />
                ))}
            </MapContainer>
            {loading && <LoadingSpinner />}
            {error &&
            <div style={{ display:'flex', flexDirection:"row"  }}>
                <p style={{color: 'red'}}>{error}</p> <button onClick={() => dispatch(clearError())}>Clear error</button>
            </div>
            }
        </div>
    );
};

export default MapComponent;