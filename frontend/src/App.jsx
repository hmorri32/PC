import { useCallback, useEffect, useMemo, useState } from 'react';
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
} from 'react-map-gl';

import * as turf from '@turf/turf';

import { Controls } from './components/Controls';

import satellite from './assets/satellite.svg';
import globe from './assets/globe.svg';
import moon from './assets/moon.svg';
import road from './assets/road.svg';
import mountain from './assets/snow.svg';

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

  const bufferGeoJSON = bufferData ? turf.featureCollection(bufferData) : null;

  const handleSetBuffer = (e) => {
    e.preventDefault();

    if (bufferSize > 0) {
      setBufferData(
        geolocationData.map((point) => {
          const turfPoint = turf.point([
            Number(point.Longitude),
            Number(point.Latitude),
          ]);

          return turf.buffer(turfPoint, bufferSize, { units: 'meters' });
        }),
      );
    } else {
      setBufferData(null);
    }
  };

  const geolocationDataToGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: geolocationData.map((point) => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.Longitude, point.Latitude],
          },
          properties: {
            id: point.id,
            TimeStamp: point.TimeStamp,
            Ch4: point.Ch4,
            C2H6: point.C2H6,
          },
        };
      }),
    };
  }, [geolocationData]);

  useEffect(() => {
    let ignore = false;
    const fetchGeolocationData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/v1/geolocationData',
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

  const memoizedMarkers = useMemo(() => {
    return geolocationData.map((point) => (
      <Marker
        key={point.id}
        latitude={point.Latitude}
        longitude={point.Longitude}
      >
        {/* <div
          style={{
            height: '10px',
            width: '10px',
            backgroundColor: 'green',
            borderRadius: '50%',
          }}
        /> */}
      </Marker>
    ));
  }, [geolocationData]);

  const dataLayer = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-color':
        selectedGas === 'Ch4'
          ? [
              'interpolate',
              ['linear'],
              ['get', 'Ch4'],
              2.1,
              '#2ecc71',
              2.4,
              '#f39c12',
              2.5,
              '#e74c3c',
              5,
              '#e74c3c',
            ]
          : [
              'interpolate',
              ['linear'],
              ['get', 'C2H6'],
              0,
              '#2ecc71',
              15,
              '#f39c12',
              20,
              '#f39c12',
              30,
              '#e74c3c',
              100,
              '#e74c3c',
            ],
    },
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

    // setSelectedFeature(
    //   // clickedFeature ? { feature: clickedFeature, longitude, latitude } : null,
    // );
  };

  return (
    <>
      <div className="control-wrapper gas-controls">
        {/* <label htmlFor="gas-selector">Select Gas: </label> */}
        <select
          className="control-input"
          onChange={(e) => setSelectedGas(e.target.value)}
          value={selectedGas}
        >
          <option value="Ch4">Methane (CH4)</option>
          <option value="C2H6">Ethane (C2H6)</option>
        </select>
      </div>
      <div className="control-wrapper buffer-controls">
        <form className="buffer-form" onSubmit={handleSetBuffer}>
          <input
            type="number"
            className="control-input"
            placeholder="Buffer Size (meters)"
            value={bufferSize}
            onChange={(e) => setBufferSize(e.target.value)}
          />
          <button className="control-input" type="submit">
            Set Buffer
          </button>
          <button className="control-input"> Save Buffers to DB</button>
        </form>
      </div>

      <Controls mapLayers={MAP_LAYERS} handleClick={handleStyleChange} />

      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
        initialViewState={{
          latitude: 42.91401640878263,
          longitude: -84.2266095259169,
          zoom: 11,
        }}
        interactiveLayerIds={['point']}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle={mapStyle.url}
        asyncRender={true}
        onClick={handleMapClick}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <NavigationControl position="top-right" />
        <Source type="geojson" data={geolocationDataToGeoJSON}>
          <Layer {...dataLayer} />
        </Source>
        {popupInfo && (
          <Popup
            longitude={popupInfo.lngLat.lng}
            latitude={popupInfo.lngLat.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
            anchor="top"
          >
            <div>
              <h3>{selectedGas} Concentration</h3>
              <p>
                {`${selectedGas}: ${
                  popupInfo.clickedFeature.properties[selectedGas]
                } ${selectedGas === 'Ch4' ? 'ppm' : 'ppb'}`}
              </p>
              <p>{`Date: ${popupInfo.clickedFeature.properties.TimeStamp}`}</p>
            </div>
          </Popup>
        )}

        <Source // set the terrain source (extract to component)
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
        {bufferGeoJSON && (
          <Source type="geojson" data={bufferGeoJSON}>
            <Layer
              id="buffer"
              type="fill"
              source="buffer"
              paint={{
                'fill-opacity': 0.2,
                'fill-color': '#d4c4f3',
              }}
            />
          </Source>
        )}
      </Map>
    </>
  );
}

export default App;
