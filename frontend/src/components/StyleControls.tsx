import arrow from '../assets/triangle.svg';
import './Controls.css';

interface MapLayer {
  type: string;
  img: string;
  url: string;
}

interface StyleControlsProps {
  mapLayers: MapLayer[];
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const StyleControls = ({
  mapLayers,
  handleClick,
}: StyleControlsProps) => {
  return (
    <aside className="controls" onClick={handleClick}>
      {mapLayers.map((layer: MapLayer, i: number) => (
        <div key={i} className="map-toggle-wrap" data-type={layer.type}>
          <span className="map-type" data-type={layer.type}>
            {layer.type}
            <img className="arrow" src={arrow} data-type={layer.type} />
          </span>
          <button className="map-btn" data-type={layer.type}>
            <img
              className="map-toggle-btn"
              src={layer.img}
              data-type={layer.type}
            />
          </button>
        </div>
      ))}
    </aside>
  );
};
