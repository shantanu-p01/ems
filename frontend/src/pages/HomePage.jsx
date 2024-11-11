import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import Auth from '../components/Auth.jsx';
import axios from 'axios';

const HomePage = () => {
  // Start with form step 1 (login) instead of registration
  const [formStep, setFormStep] = useState(1);
  const [name, setName] = useState(Cookies.get('name') || '');
  const [email, setEmail] = useState(Cookies.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mongodbUrl, setMongodbUrl] = useState(Cookies.get('mongodbUrl') || '');
  const [passphrase, setPassphrase] = useState('');

  const SERVER_ADDRESS = "https://ems-backendservice.onrender.com";
  // const SERVER_ADDRESS = "http://localhost:5174";

  useEffect(() => {
    document.title = "Employee Management System";
  }, []);

  const encryptMongodbUrl = (url, passphrase) => CryptoJS.AES.encrypt(url, passphrase).toString();
  const decryptMongodbUrl = (encryptedUrl, passphrase) => {
    try {
      return CryptoJS.AES.decrypt(encryptedUrl, passphrase).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error decrypting MongoDB URL:', error);
      return '';
    }
  };

  const nextStep = () => {
    if (formStep === 2) {
      Cookies.set('name', name);
      Cookies.set('email', email);
    } else if (formStep === 4) {
      const encryptedUrl = encryptMongodbUrl(mongodbUrl, passphrase);
      Cookies.set('mongodbUrl', encryptedUrl);
      Cookies.set('passphrase', passphrase);
    }
    setFormStep(prev => prev + 1);
  };

  const prevStep = () => setFormStep(prev => prev - 1);

  const validateStep = (step) => {
    if (step === 2) return name.trim() && email.trim();
    if (step === 3) return password === confirmPassword && password.trim();
    if (step === 4) return mongodbUrl.trim() && passphrase.trim();
    return false;
  };

  const handleCreateAccount = async () => {
    try {
      const encryptedUrl = encryptMongodbUrl(mongodbUrl, passphrase);
      const userData = { name, email, password, mongodbUrl: encryptedUrl };

      const response = await axios.post(`${SERVER_ADDRESS}/api/register`, userData);
      
      if (response.data.success) {
        alert('Account created successfully!');
        // Reset form and go back to login
        setFormStep(1);
        setPassword('');
        setConfirmPassword('');
        setMongodbUrl('');
        setPassphrase('');
      }
    } catch (error) {
      console.error('Error during account creation:', error);
      alert(error.response?.data?.message || 'An error occurred while creating the account');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${SERVER_ADDRESS}/api/login`, {
        email,
        password
      });

      if (response.data.success) {
        // Handle successful login (e.g., store token, redirect)
        Cookies.set('token', response.data.token);
        alert('Login successful!');
        // Add your redirect logic here
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert(error.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <main className="min-h-screen min-w-full flex flex-col items-center pt-20 pb-10 bg-gray-900 text-gray-200">
      <section className="w-11/12 sm:w-4/5 bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between mb-12 shadow-lg">
        <div className="sm:w-1/2 text-center sm:text-left mb-6 sm:mb-0">
          <h1 className="text-4xl font-bold text-white">Welcome to <span className="text-red-600">E</span>MS!</h1>
          <p className="text-lg text-gray-400 mt-2">Manage your team efficiently and effectively</p>
        </div>
        <div className="w-full sm:w-1/2 bg-gray-700 rounded-lg shadow-md">
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
            passphrase={passphrase} setPassphrase={setPassphrase}
            nextStep={nextStep} prevStep={prevStep} 
            validateStep={validateStep} 
            handleCreateAccount={handleCreateAccount} 
          />
        </div>
      </section>
    </main>
  );
};

export default HomePage;