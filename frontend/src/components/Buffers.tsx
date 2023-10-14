import { Layer, Source } from 'react-map-gl';
import { FeatureCollection, Polygon } from 'geojson';

interface BuffersProps {
  bufferData: FeatureCollection<Polygon>;
}

export const Buffers = ({ bufferData }: BuffersProps) => (
  <Source type="geojson" data={bufferData}>
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
);
