import { Source } from 'react-map-gl';

export const Terrain = () => (
  <Source
    id="mapbox-dem"
    type="raster-dem"
    url="mapbox://mapbox.mapbox-terrain-dem-v1"
    tileSize={512}
    maxzoom={14}
  />
);
