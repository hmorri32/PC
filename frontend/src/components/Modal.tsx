import * as ReactModal from 'react-modal';
import './Modal.css';

ReactModal.setAppElement('#root');

export const Modal = ({ children, isOpen, onRequestClose }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      {children}
    </ReactModal>
  );
};
