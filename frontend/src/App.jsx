import { useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl';

import * as turf from '@turf/turf';

import { BufferControls } from './components/BufferControls';
import { Buffers } from './components/Buffers';
import { GasControls } from './components/GasControls';
import { GasDetailsPopup } from './components/GasDetailsPopup';
import { LocationPoints } from './components/LocationPoints';
import { Modal } from './components/Modal';
import { StyleControls } from './components/StyleControls';
import { Terrain } from './components/Terrain';

import { useFetchBufferData, useFetchGeoJsonData } from './hooks/useFetch';

import globe from './assets/globe.svg';
import moon from './assets/moon.svg';
import mountain from './assets/snow.svg';
import road from './assets/road.svg';
import satellite from './assets/satellite.svg';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

const MAP_LAYERS = [
  {
    type: 'Light',
    url: 'mapbox://styles/mapbox/light-v10?optimize=true',
    img: globe,
  },
  {
    type: 'Dark',
    url: 'mapbox://styles/mapbox/dark-v10?optimize=true',
    img: moon,
  },
  {
    type: 'Street',
    url: 'mapbox://styles/mapbox/streets-v11?optimize=true',
    img: road,
  },
  {
    type: 'Satellite',
    url: 'mapbox://styles/mapbox/satellite-streets-v12?optimize=true',
    img: satellite,
  },
  {
    type: 'Outdoor',
    url: 'mapbox://styles/mapbox/outdoors-v11?optimize=true',
    img: mountain,
  },
];

function App() {
  const [mapStyle, setMapStyle] = useState(MAP_LAYERS[0]);
  const [bufferSize, setBufferSize] = useState(0);
  const [selectedGas, setSelectedGas] = useState('Ch4');

  const [geoJSONFeatures, setGeoJSONFeatures] = useState([]);
  const [bufferGeoJson, setBufferGeoJson] = useState([]);

  const [popupInfo, setPopupInfo] = useState(null);
  const [modalData, setModalData] = useState(null);

  useFetchGeoJsonData({ setGeoJSONFeatures, setModalData });
  useFetchBufferData({ geoJSONFeatures, setModalData, setBufferGeoJson });

  const postBufferData = async (e) => {
    e.preventDefault();

    const buffers = turf.buffer(
      geoJSONFeatures[0].geojson_feature,
      bufferSize,
      { units: 'meters' },
    );

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/geojson/${geoJSONFeatures[0].id}/buffer-geom`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buffers),
        },
      );

      if (!response.ok) {
        let data = await response.json();
        throw new Error(
          `Request failed ${response.status}: ${data.description}`,
        );
      }

      const json = await response.json();

      setBufferGeoJson(json);

      setModalData({ message: json.message });
    } catch (e) {
      setModalData(e);
    }
  };

  const handleStyleChange = (e) => {
    const elementType = e.target.getAttribute('data-type');

    const newStyle = MAP_LAYERS.find((style) => style.type === elementType);

    if (newStyle) {
      setMapStyle(newStyle);
    }
  };

  const handleMapClick = (event) => {
    const { features } = event;

    const clickedFeature = features && features[0];

    if (clickedFeature) {
      setPopupInfo({
        lngLat: event.lngLat,
        clickedFeature,
      });
    }
  };

  return (
    <>
      <GasControls selectedGas={selectedGas} setSelectedGas={setSelectedGas} />
      <BufferControls
        bufferSize={bufferSize}
        setBufferSize={setBufferSize}
        postBufferData={postBufferData}
      />
      <StyleControls mapLayers={MAP_LAYERS} handleClick={handleStyleChange} />

      <Modal isOpen={!!modalData} onRequestClose={() => setModalData(null)}>
        <div>
          <h2>{modalData && modalData.message}</h2>
        </div>
      </Modal>

      <Map
        interactiveLayerIds={['point']}
        initialViewState={{
          latitude: 42.91401640878263,
          longitude: -84.2266095259169,
          zoom: 11.6,
        }}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
        mapStyle={mapStyle.url}
        onClick={handleMapClick}
        style={{ width: '100vw', height: '100vh' }}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <NavigationControl position="top-right" />
        <Terrain />
        {geoJSONFeatures && geoJSONFeatures.length > 0 && (
          <LocationPoints
            geoJSONFeatures={geoJSONFeatures}
            selectedGas={selectedGas}
          />
        )}
        {popupInfo && (
          <GasDetailsPopup
            latitude={popupInfo.lngLat.lat}
            longitude={popupInfo.lngLat.lng}
            selectedGas={selectedGas}
            setPopupInfo={setPopupInfo}
            properties={popupInfo.clickedFeature.properties}
          />
        )}

        {bufferGeoJson.data && <Buffers bufferData={bufferGeoJson.data} />}
      </Map>
    </>
  );
}

export default App;
