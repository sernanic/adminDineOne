import React from 'react';

const Drawer = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Drawer;