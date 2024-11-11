import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Auth from '../components/Auth.jsx';

const HomePage = () => {
  const SERVER_ADDRESS = "https://ems-backendservice.onrender.com"; // Update to production URL as needed
  const [formStep, setFormStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mongodbUrl, setMongodbUrl] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state for token verification

  useEffect(() => {
    const token = Cookies.get('token');
    // console.log('Token found in cookies:', token);  // Tp Debugging line
    if (token) {
      axios.post(`${SERVER_ADDRESS}/api/verify-token`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Check if the token from the database matches the token from the cookie
        if (response.data.token !== token) {
          // If the tokens don't match, log the user out
          handleLogout();
        } else {
          setIsLoggedIn(true);
          setEmail(Cookies.get('email') || '');
  
          // Update the 'name' field in cookies or set it if it doesn't exist
          Cookies.set('name', response.data.name, { expires: 7, secure: true });
          setName(response.data.name);  // Update the state with the name
        }
      })
      .catch(() => {
        // On failure, remove all related cookies
        Cookies.remove('token'); 
        Cookies.remove('email'); 
        Cookies.remove('name'); 
      })
      .finally(() => {
        setLoading(false);  // Stop loading once verification is done
      });
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);

  const encrypt = (text, passphrase) => CryptoJS.AES.encrypt(text, passphrase).toString();
  const decrypt = (encryptedText, passphrase) => {
    try {
      return CryptoJS.AES.decrypt(encryptedText, passphrase).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return '';
    }
  };

  const handleRegister = async () => {
    try {
      const encryptedUrl = encrypt(mongodbUrl, passphrase);
      const userData = { name, email, password, mongodbUrl: encryptedUrl };
      const response = await axios.post(`${SERVER_ADDRESS}/api/register`, userData);

      if (response.data.success) {
        alert('Account registered successfully!');
        Cookies.set('mongodbUrl', encryptedUrl, { expires: 365, secure: true });
        Cookies.set('email', email, { expires: 365, secure: true });
        resetForm();
      }
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${SERVER_ADDRESS}/api/login`, { email, password });
      if (response.data.success) {
        Cookies.set('token', response.data.token, { expires: 7, secure: true });  // Set cookies to expire in 7 days
        Cookies.set('email', email, { expires: 7, secure: true });  // Set cookies to expire in 7 days
        Cookies.set('name', response.data.name, { expires: 7, secure: true }); // Set cookies to expire in 7 days
        setIsLoggedIn(true);  // Set logged in status
        setName(response.data.name); // Set name after login
        alert('Logged in successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Invalid credentials');
    }
  };

  const handleLogout = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        await axios.post(`${SERVER_ADDRESS}/api/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      Cookies.remove('token'); // Remove token
      Cookies.remove('email'); // Remove email
      Cookies.remove('name'); // Remove name
      setIsLoggedIn(false); // Set logged out status
      setEmail('');
      setName('');
      alert('Logged out successfully!');
    } catch (error) {
      alert('Error logging out');
    }
  };

  const resetForm = () => {
    setFormStep(1);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMongodbUrl('');
    setPassphrase('');
  };

  useEffect(() => {
    if (formStep === 2) {
      setEmail(''); // Clear email on registration form
      setPassword('');
      setConfirmPassword('');
      setMongodbUrl('');
      setPassphrase('');
    } else if (formStep === 1 && !isLoggedIn) {
      setEmail(Cookies.get('email') || ''); // Prepopulate email in login form if not logged in
      setPassword('');
    }
  }, [formStep, isLoggedIn]);

  return (
    <main className="min-h-screen min-w-full flex flex-col items-center pt-20 pb-10 bg-gray-900 text-gray-200">
      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : (
        <section className="w-11/12 sm:w-4/5 bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between mb-12 shadow-lg">
          {/* Conditionally render Welcome or User Details */}
          <div className="sm:w-1/2 text-center sm:text-left mb-6 sm:mb-0">
            {isLoggedIn ? (
              <>
                <h1 className="text-4xl font-bold text-white">Welcome, <span className="text-green-400">{name}</span>!</h1>
                <button
                  onClick={handleLogout}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-white">Welcome to <span className="text-red-600">E</span>MS!</h1>
                <p className="text-lg text-gray-400 mt-2">Manage your team efficiently and effectively</p>
              </>
            )}
          </div>

          {/* Conditionally render Auth component or welcome message based on login status */}
          <div className="w-full sm:w-1/2 bg-gray-700 rounded-lg shadow-md">
            {isLoggedIn ? null : (
              <Auth
                formStep={formStep} 
                setFormStep={setFormStep}
                name={name} 
                setName={setName}
                email={email} 
                setEmail={setEmail}
                password={password} 
                setPassword={setPassword}
                confirmPassword={confirmPassword} 
                setConfirmPassword={setConfirmPassword}
                mongodbUrl={mongodbUrl} 
                setMongodbUrl={setMongodbUrl}
                passphrase={passphrase} 
                setPassphrase={setPassphrase}
                handleRegister={handleRegister} // Ensure this is passed here
                handleLogin={handleLogin}
                nextStep={() => setFormStep(prev => prev + 1)}
                prevStep={() => setFormStep(prev => prev - 1)}
                validateStep={(step) =>
                  step === 2 ? name && email :
                  step === 3 ? password && password === confirmPassword :
                  step === 4 ? mongodbUrl && passphrase : false
                }
              />

            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default HomePage;