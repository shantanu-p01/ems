import React from 'react';

const AboutModal = ({ closeModal }) => (
  <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 select-none">
    <div className="bg-[#212221] p-6 py-4 rounded-lg w-11/12 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">About</h2>
      <p className="mb-4 text-center">
        The Employee Management System (EMS) helps organizations manage employee data effectively. It allows for
        easy addition, updating, and deletion of employee information, and provides tools for tracking performance, 
        attendance, and more.
      </p>
      <button
        onClick={closeModal}
        className="px-4 py-2 w-full bg-red-500 text-white rounded-md hover:bg-red-600">
        Close
      </button>
    </div>
  </div>
);

export default AboutModal;