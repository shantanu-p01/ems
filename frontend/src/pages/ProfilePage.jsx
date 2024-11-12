import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import MessageModal from './../modals/MessageModal';
import { FaPen } from 'react-icons/fa'; // Pencil Icon

const SERVER_ADDRESS = "https://ems-backendservice.onrender.com";

const ProfilePage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', position: '', bio: '', profileImage: '' });
  const [editableFields, setEditableFields] = useState({ name: false, position: false, bio: false, profileImage: false });
  const [formStatus, setFormStatus] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [originalData, setOriginalData] = useState({ name: '', email: '', position: '', bio: '', profileImage: '' });

  useEffect(() => {
    document.title = 'EMS - Profile';
    const token = Cookies.get('token');

    if (!token) return setShowRedirectMessage(true);

    axios.get(`${SERVER_ADDRESS}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        const profile = response.data.profile;
        if (response.data.success && profile) {
          setFormData(profile);
          setOriginalData(profile);
        } else handleLogout();
      })
      .catch(handleLogout);
  }, []);

  useEffect(() => {
    if (showRedirectMessage) {
      const countdownInterval = setInterval(() => {
        setRedirectCountdown(prev => prev > 1 ? prev - 1 : (handleLogout(), clearInterval(countdownInterval)));
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [showRedirectMessage]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('email');
    Cookies.remove('name');
    setShowRedirectMessage(true);
    window.location.replace('/');
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setFormStatus('Please select a valid image (JPG, PNG, or GIF).');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return setFormStatus('Name is required.');
    if (JSON.stringify(formData) === JSON.stringify(originalData)) return setFormStatus('You have not updated any fields.');

    const token = Cookies.get('token');
    if (token) {
      axios.post(`${SERVER_ADDRESS}/api/updateProfile`, formData, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          if (response.data.success) {
            setFormStatus('Profile updated successfully!');
            setEditableFields({ name: false, position: false, bio: false, profileImage: false });
            setOriginalData(formData);
          } else setFormStatus('Failed to update profile.');
        })
        .catch(() => setFormStatus('Error updating profile.'));
    }
  };

  const toggleFieldEdit = (field) => setEditableFields({ ...editableFields, [field]: !editableFields[field] });

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-5 ${!showRedirectMessage ? 'pt-20' : ''}`}>
      {showRedirectMessage ? (
        <div className="text-center text-white">
          <p>User not logged in. Redirecting to homepage in {redirectCountdown}...</p>
        </div>
      ) : (
        <div className="max-w-lg w-full bg-[#212121] p-4 rounded shadow-lg">
          <h1 className="text-3xl font-semibold text-center mb-6 text-white">Profile</h1>

          {/* Profile Image, Name, and Position Section */}
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 mb-4 relative">

            {/* Profile Image */}
            <div className="size-28 rounded-full overflow-hidden border-2 border-gray-200 relative group">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                                  <img
                  src="placeholder.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                </div>
              )}

              {/* Pencil Icon on Hover */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300">
                <label htmlFor="imageUpload" className="cursor-pointer text-white text-2xl">
                  <FaPen />
                </label>
              </div>

              {/* Hidden File Input for Image Upload */}
              <input
                type="file"
                id="imageUpload"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Name and Position */}
            <div className="text-white w-full md:w-2/3">
              {/* Name Field */}
              <div className="flex items-center justify-between">
                <label htmlFor="name" className="text-sm">Name</label>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('name')}
                  className={`text-sm ${editableFields.name ? 'text-red-500 hover:text-red-600' : 'text-blue-500 hover:text-blue-700'}`}
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
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                disabled={!editableFields.name}
              />

              {/* Position Field */}
              <div className="flex items-center justify-between">
                <label htmlFor="position" className="text-sm">Position</label>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('position')}
                  className={`text-sm ${editableFields.position ? 'text-red-500 hover:text-red-600' : 'text-blue-500 hover:text-blue-700'}`}
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
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                disabled={!editableFields.position}
              />
            </div>
          </div>

          {/* Email, Bio, and Save Button Section */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
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

            {/* Bio Field */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-200">Bio</label>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('bio')}
                  className={`focus:outline-none ${editableFields.bio ? 'text-red-500 hover:text-red-600' : 'text-blue-500 hover:text-blue-700'}`}
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
                rows="5"
                placeholder="Add Bio"
                disabled={!editableFields.bio}
              />
            </div>

            {/* Save Button */}
            <div className="text-center mt-4">
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
      <MessageModal message={formStatus} onClose={() => setFormStatus('')} />
    </div>
  );
};

export default ProfilePage;
