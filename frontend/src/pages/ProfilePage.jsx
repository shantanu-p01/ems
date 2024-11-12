import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import MessageModal from './../modals/MessageModal';

const SERVER_ADDRESS = "https://ems-backendservice.onrender.com"; // Update to production URL as needed

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    bio: ''
  });
  const [editableFields, setEditableFields] = useState({
    name: false,
    position: false,
    bio: false,
  });
  const [formStatus, setFormStatus] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    position: '',
    bio: ''
  });

  useEffect(() => {
    document.title = 'EMS - Profile';

    const token = Cookies.get('token');

    if (token) {
      axios.get(`${SERVER_ADDRESS}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          if (response.data.success) {
            // If profile data is fetched successfully, update form data
            const profile = response.data.profile;
            setFormData({
              name: profile.name || '',
              email: profile.email || '',
              position: profile.position || '',
              bio: profile.bio || ''
            });
            setOriginalData({
              name: profile.name || '',
              email: profile.email || '',
              position: profile.position || '',
              bio: profile.bio || ''
            });
          } else {
            setShowRedirectMessage(true);
            Cookies.remove('token'); 
            Cookies.remove('email'); 
            Cookies.remove('name'); 
          }
        })
        .catch(() => {
          setShowRedirectMessage(true);
        });
    } else {
      setShowRedirectMessage(true);
    }
  }, []);

  useEffect(() => {
    let countdownInterval;
    if (showRedirectMessage) {
      countdownInterval = setInterval(() => {
        setRedirectCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownInterval);
            Cookies.remove('token');
            window.location.replace('/');
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [showRedirectMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if any field has been modified
    if (
      formData.name === originalData.name &&
      formData.position === originalData.position &&
      formData.bio === originalData.bio
    ) {
      setFormStatus('You have not updated any fields.');
      return;
    }

    if (!formData.name) {
      setFormStatus('Name is required.');
      return;
    }

    const token = Cookies.get('token');
    if (token) {
      axios.post(`${SERVER_ADDRESS}/api/updateProfile`, {
        name: formData.name,
        position: formData.position,
        bio: formData.bio
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          if (response.data.success) {
            setFormStatus('Profile updated successfully!');
            // After saving, disable editing and revert buttons to 'Edit'
            setEditableFields({
              name: false,
              position: false,
              bio: false
            });
            // Update the original data after successful save
            setOriginalData(formData);
          } else {
            setFormStatus('Failed to update profile.');
          }
        })
        .catch(() => {
          setFormStatus('Error updating profile.');
        });
    }
  };

  const handleFieldEdit = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-5 ${!showRedirectMessage ? 'pt-20' : ''}`}>
      {showRedirectMessage ? (
        <div className="text-center text-white">
          <p>User not logged in. Redirecting to homepage in {redirectCountdown}...</p>
        </div>
      ) : (
        <div className="max-w-lg w-full bg-[#212121] p-4 rounded shadow-lg">
          <h1 className="text-3xl font-semibold text-center mb-6 text-white">Profile</h1>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mt-4 flex items-center justify-between">
              <label htmlFor="name" className="block text-sm font-medium text-gray-200">Name</label>
              <button
                type="button"
                onClick={() => handleFieldEdit('name')}
                className={`focus:outline-none ${editableFields.name ? 'text-red-500 hover:text-red-600' : 'text-blue-500'} hover:text-blue-700`}
              >
                {editableFields.name ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Your full name"
              required
              disabled={!editableFields.name}
            />

            {/* Email Field - Non-editable */}
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="w-full p-2 border border-gray-300 rounded-md cursor-not-allowed"
                disabled
              />
            </div>

            {/* Position Field */}
            <div className="mt-4 flex items-center justify-between">
              <label htmlFor="position" className="block text-sm font-medium text-gray-200">Position</label>
              <button
                type="button"
                onClick={() => handleFieldEdit('position')}
                className={`focus:outline-none ${editableFields.position ? 'text-red-500 hover:text-red-600' : 'text-blue-500'} hover:text-blue-700`}
              >
                {editableFields.position ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={formData.position ? '' : 'Add Position'}
              disabled={!editableFields.position}
            />

            {/* Bio Field */}
            <div className="mt-4 flex items-center justify-between">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-200">Bio</label>
              <button
                type="button"
                onClick={() => handleFieldEdit('bio')}
                className={`focus:outline-none ${editableFields.bio ? 'text-red-500 hover:text-red-600' : 'text-blue-500'} hover:text-blue-700`}
              >
                {editableFields.bio ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={formData.bio ? '' : 'Add Bio'}
              rows="5"
              disabled={!editableFields.bio}
            ></textarea>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Message Modal */}
      <MessageModal message={formStatus} onClose={() => setFormStatus('')} />
    </div>
  );
};

export default ProfilePage;
