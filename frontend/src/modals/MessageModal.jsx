import React from 'react';

const MessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 select-none">
      <div className="bg-[#212221] p-6 py-4 rounded-lg w-11/12 max-w-sm">
      {/* Heading Text: Change color to light for better visibility */}
        <h2 className="text-center MonoBold text-xl font-semibold text-white">Notification</h2>
        {/* Message Text: Change color to light gray for readability */}
        <p className="text-center mt-4 text-gray-200">{message}</p>
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
