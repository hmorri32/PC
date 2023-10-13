import './App.css';
import Map from 'react-map-gl';

function App() {
  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}

export default App;
