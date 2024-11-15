import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import MessageModal from './../modals/MessageModal';
import { FaPen } from 'react-icons/fa'; // Pencil Icon
import BarLoader from "react-spinners/BarLoader"; // Import the loader

const SERVER_ADDRESS = "https://ems-backendservice.onrender.com";

const ProfilePage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', position: '', bio: '', profileImage: '' });
  const [editableFields, setEditableFields] = useState({ name: false, position: false, bio: false, profileImage: false });
  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [originalData, setOriginalData] = useState({ name: '', email: '', position: '', bio: '', profileImage: '' });

  useEffect(() => {
    document.title = 'EMS - Profile';
    const token = Cookies.get('token');

    if (!token) {
      setShowRedirectMessage(true);
      setLoading(false); // End loading if no token
      return;
    }

    axios.get(`${SERVER_ADDRESS}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        const profile = response.data.profile;
        if (response.data.success && profile) {
          setFormData(profile);
          setOriginalData(profile);
        } else {
          setShowRedirectMessage(true);
        }
      })
      .catch(() => setShowRedirectMessage(true))
      .finally(() => setLoading(false)); // End loading after API response
  }, []);

  useEffect(() => {
    if (showRedirectMessage) {
      const countdownInterval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            handleLogout();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [showRedirectMessage]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('email');
    Cookies.remove('name');
    window.location.replace('/');
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif")) {
      const uploadData = new FormData();
      uploadData.append("image", file);

      try {
        const response = await axios.post(`${SERVER_ADDRESS}/api/uploadImage`, uploadData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        if (response.data.success) {
          setFormData({ ...formData, profileImage: response.data.imageUrl });
          setFormStatus("Image uploaded successfully!");
        } else {
          setFormStatus("Failed to upload image.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setFormStatus("Error uploading image.");
      }
    } else {
      setFormStatus("Please select a valid image (JPG, PNG, or GIF).");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (JSON.stringify(formData) === JSON.stringify(originalData)) {
      setFormStatus('You have not updated any fields.');
      return;
    }

    const token = Cookies.get('token');
    if (token) {
      axios.post(`${SERVER_ADDRESS}/api/updateProfile`, formData, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          if (response.data.success) {
            setFormStatus('Profile updated successfully!');
            setEditableFields({ name: false, position: false, bio: false, profileImage: false });
            setOriginalData(formData);
          } else {
            setFormStatus('Failed to update profile.');
          }
        })
        .catch(() => setFormStatus('Error updating profile.'));
    }
  };

  const toggleFieldEdit = (field) => setEditableFields({ ...editableFields, [field]: !editableFields[field] });

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-5 ${!showRedirectMessage ? 'pt-20' : ''}`}>
      {loading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <BarLoader width={100} color="#ffffff" />
        </div>
      ) : showRedirectMessage ? (
        <div className="text-center text-white">
          <p>User not logged in. Redirecting to homepage in {redirectCountdown}...</p>
        </div>
      ) : (
        <div className="max-w-lg -z-10 w-full bg-[#212121] p-4 rounded shadow-lg">
          <h1 className="text-3xl font-semibold text-center mb-6 text-white">Profile</h1>
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 mb-4 relative">
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 mb-4 relative">
            <label htmlFor="imageUpload" className="size-28 rounded-full overflow-hidden border-2 border-gray-200 relative group cursor-pointer">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                  <img src="placeholder.png" alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300">
                <FaPen className="text-white text-2xl" />
              </div>
            </label>
            <input
              type="file"
              id="imageUpload"
              accept=".jpg, .jpeg, .png, .gif"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
            <div className="text-white w-full md:w-2/3">
              <div className="flex items-center justify-between">
                <label htmlFor="name" className="text-sm">Name</label>
                <button type="button" onClick={() => toggleFieldEdit('name')} className={`text-sm ${editableFields.name ? 'text-red-500 hover:text-red-600' : 'text-blue-500 hover:text-blue-700'}`}>
                  {editableFields.name ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full mb-2 p-2 border border-gray-300 rounded-md" disabled={!editableFields.name} />

              <div className="flex items-center justify-between">
                <label htmlFor="position" className="text-sm">Position</label>
                <button type="button" onClick={() => toggleFieldEdit('position')} className={`text-sm ${editableFields.position ? 'text-red-500 hover:text-red-600' : 'text-blue-500 hover:text-blue-700'}`}>
                  {editableFields.position ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <input type="text" id="position" name="position" value={formData.position} onChange={handleInputChange} className="w-full mb-2 p-2 border border-gray-300 rounded-md" disabled={!editableFields.position} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
              <input type="email" id="email" name="email" value={formData.email} className="w-full p-2 border border-gray-300 rounded-md cursor-not-allowed" disabled />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-200">Bio</label>
                <button type="button" onClick={() => toggleFieldEdit('bio')} className={`focus:outline-none ${editableFields.bio ? 'text-red-500 hover:text-red-600' : 'text-blue-500 hover:text-blue-700'}`}>
                  {editableFields.bio ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" rows="5" placeholder="Add Bio" disabled={!editableFields.bio} />
            </div>

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
