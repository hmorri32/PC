import { FeatureCollection, Point } from 'geojson';
import { useEffect } from 'react';
import { apiBaseUrl } from '../fetchConfig.js'

interface geoJSONFeatures {
  geoJSONFeatures: FeatureCollection<Point>[];
  id: string;
}

interface useFetchGeoJsonDataProps {
  setModalData: (data: any) => void;
  setGeoJSONFeatures: (data: any) => void;
}

interface useFetchBufferDataProps {
  geoJSONFeatures: geoJSONFeatures[];
  setModalData: (data: any) => void;
  setBufferGeoJson: (data: any) => void;
}

export const useFetchBufferData = ({
  geoJSONFeatures,
  setModalData,
  setBufferGeoJson,
}: useFetchBufferDataProps) => {
  useEffect(() => {
    let ignore = false;
    const fetchAndSetBufferData = async (geojsonid: string) => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/v1/location-geojson/${geojsonid}/buffer-geom`,
        );
        if (!response.ok) {
          let data = await response.json();
          throw new Error(
            `Request failed ${response.status}: ${
              data.description || data.error
            }`,
          );
        }

        const bufferData = await response.json();

        if (!ignore && bufferData && bufferData.length > 0) {
          setBufferGeoJson(bufferData[0]);
        }
      } catch (e) {
        console.log(e);
        setModalData(e);
      }
    };

    if (geoJSONFeatures && geoJSONFeatures.length > 0) {
      fetchAndSetBufferData(geoJSONFeatures[0].id);
    }

    return () => {
      ignore = true;
    };
  }, [geoJSONFeatures, setModalData, setBufferGeoJson]);
};

export const useFetchGeoJsonData = ({
  setGeoJSONFeatures,
  setModalData,
}: useFetchGeoJsonDataProps) => {
  useEffect(() => {
    let ignore = false;

    const fetchAndSetGeoJSON = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/location-geojson`);
        const geojson = await response.json();

        if (!response.ok) {
          let data = await response.json();
          throw new Error(
            `Request failed ${response.status}: ${data.description}`,
          );
        }

        if (!ignore) {
          setGeoJSONFeatures(geojson);
        }
      } catch (e) {
        setModalData(e);
      }
    };

    fetchAndSetGeoJSON();

    return () => {
      ignore = true;
    };
  }, [setGeoJSONFeatures, setModalData]);
};
