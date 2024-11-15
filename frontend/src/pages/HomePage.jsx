import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Auth from '../components/Auth.jsx';
import MessageModal from './../modals/MessageModal';
import BarLoader from "react-spinners/BarLoader";

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
  const [loadingState, setLoadingState] = useState(false); // Loading for login/logout actions
  const [message, setMessage] = useState('');  // State for message modal

  const getPublicIP = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching public IP:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      axios.post(`${SERVER_ADDRESS}/api/verify-token`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data.token !== token) {
          handleLogout();
        } else {
          setIsLoggedIn(true);
          setEmail(Cookies.get('email') || '');
          Cookies.set('name', response.data.name, { expires: 1 / 24, secure: true });
          setName(response.data.name);
        }
      })
      .catch(() => {
        Cookies.remove('token');
        Cookies.remove('email');
        Cookies.remove('name');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);
  
  const handleLogin = async () => {
    setLoadingState(true); // Show loader
    const publicIP = await getPublicIP(); // Fetch the user's public IP
    try {
      const response = await axios.post(`${SERVER_ADDRESS}/api/login`, 
        { email, password }, 
        { headers: { 'X-Public-IP': publicIP } }  // Send the public IP in the header
      );
      if (response.data.success) {
        Cookies.set('token', response.data.token, { expires: 1 / 24, secure: true });
        Cookies.set('email', email, { expires: 1 / 24, secure: true });
        Cookies.set('name', response.data.name, { expires: 1 / 24, secure: true });
        setIsLoggedIn(true);
        setName(response.data.name);
        setMessage('Logged in successfully!');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoadingState(false); // Hide loader
    }
  };

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
    setLoadingState(true); // Show loader
    try {
      const encryptedUrl = encrypt(mongodbUrl, passphrase);
      const userData = { name, email, password, mongodbUrl: encryptedUrl };
      const response = await axios.post(`${SERVER_ADDRESS}/api/register`, userData);

      if (response.data.success) {
        setMessage('Account registered successfully!');
        Cookies.set('email', email, { expires: 7, secure: true });
        resetForm();
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoadingState(false); // Hide loader
    }
  };
  
  



  const handleLogout = async () => {
    setLoadingState(true); // Show loader
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
      setMessage('Logged out successfully!');
    } catch (error) {
      setMessage('Error logging out');
    } finally {
      setLoadingState(false); // Hide loader
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
      {/* Show loader during login/logout/register */}
      {(loading || loadingState) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm">
          <BarLoader width={100} color="#ffffff" />
        </div>
      )}
      
      {/* Main Content */}
      {!loading && !loadingState && (
        <section className="w-11/12 sm:w-4/5 bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between mb-12 shadow-lg">
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

          <div className="w-full sm:w-1/2 bg-gray-700 rounded-lg shadow-md">
            {!isLoggedIn && (
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
                handleRegister={handleRegister} 
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

      {/* Message Modal */}
      <MessageModal message={message} onClose={() => setMessage('')} />
    </main>
  );
};

export default HomePage;
