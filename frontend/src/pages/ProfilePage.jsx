import { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe', // Placeholder values, replace with fetched data as needed
    email: 'johndoe@example.com',
    position: 'Software Engineer',
    bio: 'Enthusiastic developer with a passion for learning and problem-solving.'
  });

  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    // Set the document title when the component mounts
    document.title = 'EMS - Profile';

    // Fetch profile data from an API or database here
    // For example:
    // axios.get('/api/profile').then(response => {
    //   setFormData(response.data);
    // });
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.position) {
      setFormStatus('Please fill in all required fields.');
      return;
    }

    // Simulate saving data (replace with actual API call)
    setTimeout(() => {
      setFormStatus('Profile updated successfully!');
      // API call to save data:
      // axios.post('/api/profile', formData)
      //   .then(() => setFormStatus('Profile updated successfully!'))
      //   .catch(() => setFormStatus('Error updating profile.'));
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#212121] p-5 pt-20">
      <div className="max-w-lg w-full bg-[#212121] p-4 rounded shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-6 text-white">Profile</h1>

        {formStatus && <p className="text-center mb-4 text-green-500">{formStatus}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-200">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Your email address"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="position" className="block text-sm font-medium text-gray-200">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Your position or job title"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-200">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Tell us a little about yourself"
              rows="5"
            ></textarea>
          </div>

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
    </div>
  );
};

export default ProfilePage;