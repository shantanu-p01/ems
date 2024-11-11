import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import Auth from '../components/Auth.jsx';
import axios from 'axios';

const HomePage = () => {
  const SERVER_ADDRESS = "https://ems-backendservice.onrender.com"; // Update to production URL as needed
  const [formStep, setFormStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mongodbUrl, setMongodbUrl] = useState('');
  const [passphrase, setPassphrase] = useState('');

  useEffect(() => {
    document.title = "Employee Management System";
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
      console.error('Account registration error:', error);
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${SERVER_ADDRESS}/api/login`, { email, password });
      if (response.data.success) {
        Cookies.set('token', response.data.token);
        alert('Login successful!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Invalid credentials');
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
    } else if (formStep === 1) {
      setEmail(Cookies.get('email') || ''); // Prepopulate email in login form
      setPassword('')
    }
  }, [formStep]);

  return (
    <main className="min-h-screen min-w-full flex flex-col items-center pt-20 pb-10 bg-gray-900 text-gray-200">
      <section className="w-11/12 sm:w-4/5 bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between mb-12 shadow-lg">
        <div className="sm:w-1/2 text-center sm:text-left mb-6 sm:mb-0">
          <h1 className="text-4xl font-bold text-white">Welcome to <span className="text-red-600">E</span>MS!</h1>
          <p className="text-lg text-gray-400 mt-2">Manage your team efficiently and effectively</p>
        </div>
        <div className="w-full sm:w-1/2 bg-gray-700 rounded-lg shadow-md">
          <Auth
            formStep={formStep} setFormStep={setFormStep}
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            mongodbUrl={mongodbUrl} setMongodbUrl={setMongodbUrl}
            passphrase={passphrase} setPassphrase={setPassphrase}
            nextStep={() => setFormStep(prev => prev + 1)}
            prevStep={() => setFormStep(prev => prev - 1)}
            validateStep={(step) =>
              step === 2 ? name && email :
              step === 3 ? password && password === confirmPassword :
              step === 4 ? mongodbUrl && passphrase : false
            }
            handleRegister={handleRegister}
            handleLogin={handleLogin}
          />
        </div>
      </section>
    </main>
  );
};

export default HomePage;