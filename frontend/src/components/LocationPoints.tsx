import { Layer, Source } from 'react-map-gl';
import { FeatureCollection, Point } from 'geojson';

interface LocationPointsProps {
  geoJSONFeatures: FeatureCollection<Point>;
  selectedGas: string;
}

export const LocationPoints = ({
  geoJSONFeatures,
  selectedGas,
}: LocationPointsProps) => {
  return (
    <Source type="geojson" data={geoJSONFeatures[0].geojson_feature}>
      <Layer
        id="point"
        type="circle"
        paint={{
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
                  8,
                  '#2ecc71',
                  14,
                  '#f39c12',
                  20,
                  '#f39c12',
                  30,
                  '#e74c3c',
                  100,
                  '#e74c3c',
                ],
        }}
      />
    </Source>
  );
};
