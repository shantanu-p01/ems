import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Auth = ({
  formStep, setFormStep,
  name, setName, email, setEmail,
  password, setPassword, confirmPassword, setConfirmPassword,
  mongodbUrl, setMongodbUrl, passphrase, setPassphrase,
  nextStep, prevStep, validateStep, handleCreateAccount, handleLogin
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(prev => !prev);
  const handleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

  const loginForm = (
    <>
      <h2 className="text-2xl font-semibold text-white mb-4 text-center">Login</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded bg-gray-600 text-white border border-gray-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded bg-gray-600 text-white border border-gray-500"
              placeholder="Enter your password"
              required
            />
            <span onClick={handleShowPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-300">
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>
        </div>
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
  );

  const createAccountForm = (
    <>
      {formStep === 2 && (
        <>
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Create Account</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded bg-gray-600 text-white border border-gray-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded bg-gray-600 text-white border border-gray-500"
                required
              />
            </div>
            <div className="flex gap-2 w-full px-2">
              <button
                type="button"
                onClick={() => setFormStep(1)}
                className="bg-gray-600 text-white py-2 px-4 rounded w-1/2 hover:bg-gray-500"
              >
                Back
              </button>
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
      )}

      {formStep === 3 && (
        <>
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Set Password</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-gray-600 text-white border border-gray-500"
                  required
                />
                <span onClick={handleShowPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-300">
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-gray-600 text-white border border-gray-500"
                  required
                />
                <span onClick={handleShowConfirmPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-300">
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>
            </div>
            <div className="flex gap-2 w-full px-2">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-600 text-white py-2 px-4 rounded w-1/2 hover:bg-gray-500"
              >
                Back
              </button>
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
      )}

      {formStep === 4 && (
        <>
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">MongoDB URL</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="mongodbUrl" className="block text-gray-300 mb-2">MongoDB URL</label>
              <input
                type="text"
                id="mongodbUrl"
                value={mongodbUrl}
                onChange={(e) => setMongodbUrl(e.target.value)}
                className="w-full px-4 py-3 rounded bg-gray-600 text-white border border-gray-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="passphrase" className="block text-gray-300 mb-2">Passphrase</label>
              <input
                type="password"
                id="passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full px-4 py-3 rounded bg-gray-600 text-white border border-gray-500"
                required
              />
            </div>
            <div className="flex gap-2 w-full px-2">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-600 text-white py-2 px-4 rounded w-1/2 hover:bg-gray-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCreateAccount}
                disabled={!validateStep(4)}
                className="bg-blue-600 text-white py-2 px-4 rounded w-1/2 hover:bg-blue-500 disabled:bg-blue-400"
              >
                Create Account
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      {formStep === 1 ? loginForm : createAccountForm}

      <div className="mt-6 flex justify-center">
        <p className="text-gray-400 text-center">
          {formStep === 1 ? (
            <>
              Don't have an account?{" "}
              <span onClick={() => setFormStep(2)} className="text-blue-500 cursor-pointer hover:underline ml-2">
                Create one
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setFormStep(1)} className="text-blue-500 cursor-pointer hover:underline ml-2">
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;