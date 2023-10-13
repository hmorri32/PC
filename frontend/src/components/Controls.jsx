import arrow from '../assets/triangle.svg';
import PropTypes from 'prop-types';
import './controls.css';

export const Controls = ({ mapLayers, handleClick }) => {
  return (
    <aside className="controls" onClick={handleClick}>
      {mapLayers.map((layer, i) => (
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

Controls.propTypes = {
  mapLayers: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired,
};
