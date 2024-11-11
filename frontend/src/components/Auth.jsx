import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Auth = ({
  formStep, setFormStep,
  name, setName, email, setEmail,
  password, setPassword, confirmPassword, setConfirmPassword,
  mongodbUrl, setMongodbUrl, passphrase, setPassphrase,
  nextStep, prevStep, validateStep, handleRegister, handleLogin
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);

  const togglePasswordVisibility = (type) => {
    if (type === 'password') setShowPassword(prev => !prev);
    if (type === 'confirmPassword') setShowConfirmPassword(prev => !prev);
    if (type === 'passphrase') setShowPassphrase(prev => !prev);
  };

  const inputField = (id, label, value, setValue, type = 'text', isPassword = false) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <input
          type={isPassword 
            ? (id === 'password' ? (showPassword ? 'text' : 'password') 
              : id === 'confirmPassword' ? (showConfirmPassword ? 'text' : 'password') 
              : (showPassphrase ? 'text' : 'password')) 
            : type}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3 rounded bg-gray-600 text-white border border-gray-500"
          required
        />
        {isPassword && (
          <span 
            onClick={() => togglePasswordVisibility(id)} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-300"
          >
            {id === 'password' && (showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />)}
            {id === 'confirmPassword' && (showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />)}
            {id === 'passphrase' && (showPassphrase ? <FiEyeOff size={20} /> : <FiEye size={20} />)}
          </span>
        )}
      </div>
    </div>
  );

  const formContent = [
    {
      step: 1,
      content: (
        <>
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Login</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            {inputField('email', 'Email', email, setEmail, 'email')}
            {inputField('password', 'Password', password, setPassword, 'password', true)}
            <div className="w-full px-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 disabled:bg-blue-400"
                disabled={!email || !password}
              >
                Log In
              </button>
            </div>
          </form>
        </>
      )
    },
    {
      step: 2,
      content: (
        <>
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Register</h2>
          <form>
            {inputField('name', 'Name', name, setName)}
            {inputField('email', 'Email', email, setEmail, 'email')}
            <div className="flex gap-2 w-full px-2">
              <button type="button" onClick={() => setFormStep(1)} className="bg-gray-600 text-white py-2 px-4 rounded w-1/2 hover:bg-gray-500">Back</button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateStep(2)}
                className="bg-blue-600 text-white py-2 px-4 rounded w-1/2 hover:bg-blue-500 disabled:bg-blue-400"
              >
                Next
              </button>
            </div>
          </form>
        </>
      )
    },
    {
      step: 3,
      content: (
        <>
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Set Password</h2>
          <form>
            {inputField('password', 'Password', password, setPassword, 'password', true)}
            {inputField('confirmPassword', 'Confirm Password', confirmPassword, setConfirmPassword, 'password', true)}
            <div className="flex gap-2 w-full px-2">
              <button type="button" onClick={prevStep} className="bg-gray-600 text-white py-2 px-4 rounded w-1/2 hover:bg-gray-500">Back</button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateStep(3)}
                className="bg-blue-600 text-white py-2 px-4 rounded w-1/2 hover:bg-blue-500 disabled:bg-blue-400"
              >
                Next
              </button>
            </div>
          </form>
        </>
      )
    },
    {
      step: 4,
      content: (
        <>
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">MongoDB URL</h2>
          <form>
            {inputField('mongodbUrl', 'MongoDB URL', mongodbUrl, setMongodbUrl)}
            {inputField('passphrase', 'Passphrase', passphrase, setPassphrase, 'password', true)}
            <div className="flex gap-2 w-full px-2">
              <button type="button" onClick={prevStep} className="bg-gray-600 text-white py-2 px-4 rounded w-1/2 hover:bg-gray-500">Back</button>
              <button
                type="button"
                onClick={handleRegister}
                disabled={!validateStep(4)}
                className="bg-blue-600 text-white py-2 px-4 rounded w-1/2 hover:bg-blue-500 disabled:bg-blue-400"
              >
                Register
              </button>
            </div>
          </form>
        </>
      )
    }
  ];

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      {formContent.find(form => form.step === formStep)?.content}

      <div className="mt-6 flex justify-center">
        <p className="text-gray-400 text-center">
          {formStep === 1 ? (
            <>Don't have an account? <span onClick={() => setFormStep(2)} className="text-blue-500 cursor-pointer hover:underline ml-2">Register</span></>
          ) : (
            <>Already have an account? <span onClick={() => setFormStep(1)} className="text-blue-500 cursor-pointer hover:underline ml-2">Login</span></>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;