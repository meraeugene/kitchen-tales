import React from "react";

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onConfirm,
  onCancel,
  message,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-[90%] rounded-lg bg-white p-6 shadow-lg md:w-96">
        <p className="mb-4 text-lg text-gray-700">
          Are you sure you want to delete{" "}
          <span className="font-medium text-black">{message}</span> ?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 hover:text-black"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
