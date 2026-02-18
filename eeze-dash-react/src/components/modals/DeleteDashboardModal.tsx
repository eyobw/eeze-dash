import Modal from './Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteDashboardModal({ open, onClose, onConfirm }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ok
          </button>
        </>
      }
    >
      <p>
        Are you sure you want to delete all of your charts and start all
        over again?
      </p>
    </Modal>
  );
}
