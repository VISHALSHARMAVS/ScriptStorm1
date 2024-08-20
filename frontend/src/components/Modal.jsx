/* eslint-disable react/prop-types */

import { HiOutlineExclamationCircle } from 'react-icons/hi';

const Modal = ({ show, onClose, handleDeleteUser,heading }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg max-w-md w-full">
        <div className="p-4">
          <button
            onClick={onClose}
            className="float-right  text-gray-400 text-3xl hover:text-gray-600 dark:hover:text-gray-300"
          >
            &times;
          </button>
        </div>
        <div className="p-6 text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            {heading}
          </h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDeleteUser}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
             { `Yes, I'm sure`}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
