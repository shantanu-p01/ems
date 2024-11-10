import React from 'react';

const PrivacyPolicyModal = ({ closeModal }) => (
  <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-[#212121] p-6 py-4 rounded-lg w-11/12 max-w-3xl h-[500px] flex flex-col">
      {/* Fixed Header */}
      <h2 className="text-xl font-bold text-center text-white mb-4 sticky top-0 bg-[#212121] py-2 z-10">
        Privacy Policy
      </h2>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-white mb-4">
          Welcome to our Privacy Policy page. At Employee Management System (EMS), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
        </p>
        
        <p className="text-white mb-4">
          1. **Information Collection**: We collect personal information when you use our EMS services, including but not limited to your name, email address, and company information.
        </p>

        <p className="text-white mb-4">
          2. **How We Use Your Information**: The personal information we collect is used to provide, improve, and personalize the services we offer. This may include sending you updates or promotions related to EMS services.
        </p>

        <p className="text-white mb-4">
          3. **Data Security**: We employ a variety of security measures to ensure that your personal information is protected. However, please be aware that no data transmission method or storage system is 100% secure.
        </p>

        <p className="text-white mb-4">
          4. **Third-Party Sharing**: We do not share your personal information with third parties, except as necessary to provide our services or as required by law.
        </p>

        <p className="text-white mb-4">
          5. **Cookies and Tracking**: We use cookies and other tracking technologies to enhance your experience on our website. By using our services, you consent to the use of cookies.
        </p>

        <p className="text-white mb-4">
          6. **Your Rights**: You have the right to access, modify, or delete your personal information. If you wish to exercise these rights, please contact us through the appropriate channels.
        </p>

        <p className="text-white mb-4">
          7. **Changes to This Policy**: We may update this Privacy Policy from time to time. When we make changes, we will post the updated policy on this page.
        </p>
      </div>

      {/* Fixed Footer */}
      <button
        onClick={closeModal}
        className="px-4 py-2 bg-red-500 w-full text-white rounded-md hover:bg-red-600 mt-2">
        Close
      </button>
    </div>
  </div>
);

export default PrivacyPolicyModal;