import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; 
import CryptoJS from 'crypto-js'; 
import Auth from '../components/Auth.jsx';
import axios from 'axios';

const HomePage = () => {
  const [formStep, setFormStep] = useState(1);
  const [name, setName] = useState(Cookies.get('name') || '');
  const [email, setEmail] = useState(Cookies.get('email') || '');
  const [password, setPassword] = useState(Cookies.get('password') || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mongodbUrl, setMongodbUrl] = useState(Cookies.get('mongodbUrl') || '');
  const [passphrase, setPassphrase] = useState('');
  
  useEffect(() => {
    document.title = "Employee Management System";
  }, []);

  const encryptMongodbUrl = (url, passphrase) => CryptoJS.AES.encrypt(url, passphrase).toString();
  const decryptMongodbUrl = (encryptedUrl, passphrase) => CryptoJS.AES.decrypt(encryptedUrl, passphrase).toString(CryptoJS.enc.Utf8);

  const nextStep = () => {
    if (formStep === 1) {
      Cookies.set('name', name);
      Cookies.set('email', email);
    } else if (formStep === 3) {
      Cookies.set('mongodbUrl', encryptMongodbUrl(mongodbUrl, passphrase));
      Cookies.set('passphrase', passphrase);
    }
    setFormStep(prev => prev + 1);
  };

  const prevStep = () => setFormStep(prev => prev - 1);

  const validateStep = (step) => {
    if (step === 1) return name.trim() && email.trim();
    if (step === 2) return password === confirmPassword && password.trim();
    if (step === 3) return mongodbUrl.trim() && passphrase.trim();
  };
  
  const handleCreateAccount = async () => {
    try {
      const encryptedUrl = encryptMongodbUrl(mongodbUrl, passphrase);
      const userData = { name, email, password, mongodbUrl: encryptedUrl };
  
      // Log the data being sent to the server
      console.log('Sending user data:', userData);
  
      // Correct API URL with the right backend address
      const response = await axios.post('/api/register', userData);
      console.log(response.data);
      if (response.data.success) {
        alert('Account created successfully!');
        setFormStep(1);
      }
    } catch (error) {
      console.error('Error during account creation:', error);
      alert('An error occurred while creating the account');
    }
  };

  useEffect(() => {
    if (formStep === 4) {
      const decryptedUrl = decryptMongodbUrl(Cookies.get('mongodbUrl'), Cookies.get('passphrase'));
      console.log('Decrypted MongoDB URL:', decryptedUrl);
    }
  }, [formStep]);

  return (
    <main className="min-h-screen min-w-full flex flex-col items-center pt-20 pb-10 bg-gray-900 text-gray-200">
      <section className="w-11/12 sm:w-4/5 bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between mb-12 shadow-lg">
        <div className="sm:w-1/2 text-center sm:text-left mb-6 sm:mb-0">
          <h1 className="text-4xl font-bold text-white">Welcome to <span className='text-red-600'>E</span>MS!</h1>
          <p className="text-lg text-gray-400 mt-2">Manage your team efficiently and effectively</p>
        </div>
        <div className="w-full sm:w-1/2 bg-gray-700 rounded-lg  shadow-md">
          <Auth 
            formStep={formStep} 
            setFormStep={setFormStep}
            name={name} setName={setName} 
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            mongodbUrl={mongodbUrl} setMongodbUrl={setMongodbUrl}
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