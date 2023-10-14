import { Popup } from 'react-map-gl';

interface GasDetailsPopupProps {
  latitude: number;
  longitude: number;
  properties: { [key: string]: number | string };
  selectedGas: string;
  setPopupInfo: (info: any) => void;
}

export const GasDetailsPopup = ({
  latitude,
  longitude,
  properties,
  selectedGas,
  setPopupInfo,
}: GasDetailsPopupProps) => (
  <Popup
    anchor="top"
    closeButton={true}
    closeOnClick={false}
    latitude={latitude}
    longitude={longitude}
    onClose={() => setPopupInfo(null)}
  >
    <div>
      <h3>{selectedGas} Concentration</h3>
      <p>
        {`${selectedGas}: ${properties[selectedGas]} ${
          selectedGas === 'Ch4' ? 'ppm' : 'ppb'
        }`}
      </p>
      <p>{`Date: ${properties.TimeStamp}`}</p>
    </div>
  </Popup>
);
