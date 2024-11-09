import React from 'react';

const TermsOfServiceModal = ({ closeModal }) => (
  <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-[#212121] p-6 py-4 rounded-lg w-11/12 max-w-3xl h-[500px] flex flex-col">
      {/* Fixed Header */}
      <h2 className="text-2xl font-bold text-center text-white mb-4 sticky top-0 bg-[#212121] py-2 pb-0 z-10">
        Terms of Service
      </h2>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-white mb-4">
          Welcome to our Employee Management System (EMS). By using this website or application, you agree to the following terms and conditions:
        </p>
        
        <p className="text-white mb-4">
          1. **Usage of Service**: You are granted a non-exclusive, non-transferable license to use the EMS software for its intended purpose within your organization.
        </p>

        <p className="text-white mb-4">
          2. **Account Responsibility**: You are responsible for all activities conducted through your user account and agree to notify us of any unauthorized use.
        </p>

        <p className="text-white mb-4">
          3. **Privacy**: We take your privacy seriously. Please refer to our Privacy Policy to understand how your personal data is collected and used.
        </p>

        <p className="text-white mb-4">
          4. **Termination**: We may terminate or suspend your access to the EMS service at any time, without notice, for violation of these terms.
        </p>

        <p className="text-white mb-4">
          5. **Limitation of Liability**: We are not liable for any indirect, incidental, or consequential damages arising from the use of the EMS service.
        </p>

        <p className="text-white mb-4">
          6. **Changes to Terms**: We reserve the right to modify these terms at any time. Changes will be posted on this page.
        </p>
      </div>

      {/* Fixed Footer */}
      <button
        onClick={closeModal}
        className="px-4 py-2 mt-2 w-full bg-red-500 text-white rounded-md hover:bg-red-600">
        Close
      </button>
    </div>
  </div>
);

export default TermsOfServiceModal;