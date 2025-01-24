Weather app

Author: Marcin Zaręba

## Description
This is a simple weather app that uses weatherAPI for weather data and overpass (with react-leaflet) for map data. The app is written in React.

## How to run
For development: npm run dev

## Code structure
in src/redux are files related to redux store: epics, slices and store itself.

in src/components are components that are used in the app. 

There is a custom styled component: src/components/CenterToLocationButton.jsx

in src/services are files related to fetching data from APIs and getting user location.

in src/main.jsx is the main file that renders the app, while in src/App.jsx is the main component of the app.

