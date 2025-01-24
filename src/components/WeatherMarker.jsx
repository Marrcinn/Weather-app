import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const WeatherMarker = ({ city }) => {
  if (!city) {
    return null;
  }
    if(!city.weather){
        return null
    }



  const getWeatherEmoji = (weather) => {
    const temperature = weather.current.temp_c;
    const isRaining = weather.current.condition.text.includes('rain');

    if (!isRaining && temperature >= 18 && temperature <= 25) {
        // Happy emoji
        return '😎';
    } else if (!isRaining || (temperature >= 18 && temperature <= 25)) {
        // Neutral emoji
      return '😐';
    } else {
        // Angry emoji
      return '😡';
    }
  };

  const getWeatherIcon = (weather) => {
      return `http:${weather.current.condition.icon}`;
  };


    const customIcon = L.divIcon({
        html: `<div style="font-size: 15px;">
            <img src="${getWeatherIcon(city.weather)}" alt="Weather icon" style="width: 25px; height: 25px;"
            />
            ${getWeatherEmoji(city.weather)}</div>`,
        className: 'custom-marker-icon',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [0, -25]
    });

  return (
    <Marker position={[city.lat, city.lon]} icon={customIcon}>
        <Popup>
            <div>
                <h3>{city.name}</h3>
                {city.weather && (
                    <div>
                        <p>Temperature: {city.weather.current.temp_c}°C</p>
                        <p>Condition: {city.weather.current.condition.text}</p>
                    </div>
                )}
            </div>
        </Popup>
    </Marker>
  );
};

export default WeatherMarker;
