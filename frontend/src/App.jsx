import { useEffect, useMemo, useState } from 'react';
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
  const [geolocationData, setGeolocationData] = useState([]);
  const [bufferSize, setBufferSize] = useState('');
  const [bufferData, setBufferData] = useState();
  const [selectedGas, setSelectedGas] = useState('Ch4');
  const [popupInfo, setPopupInfo] = useState(null);
  const [geoJSONFeatures, setGeoJSONFeatures] = useState([]);
  const [modalData, setModalData] = useState(null);

  const postBufferData = (e) => {
    e.preventDefault();

    fetch(
      `http://localhost:3000/api/v1/geojson/${geoJSONFeatures[0].id}/buffer-geom`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bufferData),
      },
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(`Request failed: ${data.error}`);
          });
        }
        return response.json();
      })
      .then((json) => {
        setModalData({
          message: json.message,
        });
      })
      .catch((error) => {
        setModalData(error);
      });
  };

  const handleSetBuffer = (e) => {
    e.preventDefault();

    if (bufferSize > 0) {
      setBufferData(
        turf.buffer(geoJSONFeatures[0].geojson_feature, bufferSize, {
          units: 'meters',
        }),
      );
    } else {
      setBufferData(null);
    }
  };

  // const geolocationDataToGeoJSON = useMemo(() => {
  //   return {
  //     type: 'FeatureCollection',
  //     features: geolocationData.map((point) => {
  //       return {
  //         type: 'Feature',
  //         geometry: {
  //           type: 'Point',
  //           coordinates: [point.Longitude, point.Latitude],
  //         },
  //         properties: {
  //           id: point.id,
  //           TimeStamp: point.TimeStamp,
  //           Ch4: point.Ch4,
  //           C2H6: point.C2H6,
  //         },
  //       };
  //     }),
  //   };
  // }, [geolocationData]);

  useEffect(() => {
    let ignore = false;
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/geojson');
        const geojson = await response.json();

        if (!ignore) {
          setGeoJSONFeatures(geojson);
        }
      } catch (e) {
        setModalData(e);
      }
    };

    fetchGeoJSON();

    return () => (ignore = true);
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchGeolocationData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/v1/geolocation-data',
        );

        const geolocationData = await response.json();

        if (!ignore) {
          setGeolocationData(geolocationData);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchGeolocationData();

    return () => (ignore = true);
  }, []);

  const handleStyleChange = (e) => {
    const elementType = e.target.getAttribute('data-type');

    const newStyle = MAP_LAYERS.find((style) => style.type === elementType);

    setMapStyle(newStyle);
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
        disabled={!bufferData || !bufferSize}
        bufferSize={bufferSize}
        handleSetBuffer={handleSetBuffer}
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
        asyncRender={true}
        interactiveLayerIds={['point']}
        initialViewState={{
          latitude: 42.91401640878263,
          longitude: -84.2266095259169,
          zoom: 11,
        }}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
        mapStyle={mapStyle.url}
        onClick={handleMapClick}
        style={{ width: '100vw', height: '100vh' }}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <NavigationControl position="top-right" />
        <Terrain />
        {geoJSONFeatures.length > 0 && (
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

        {bufferData && <Buffers bufferData={bufferData} />}
      </Map>
    </>
  );
}

export default App;
