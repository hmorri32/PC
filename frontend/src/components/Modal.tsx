import ReactModal from 'react-modal';
import './Modal.css';

ReactModal.setAppElement('#root');

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
}

export const Modal = ({ children, isOpen, onRequestClose }: ModalProps) => {
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
