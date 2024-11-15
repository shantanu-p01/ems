import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import BarLoader from "react-spinners/BarLoader"; // Import the loader

const SERVER_ADDRESS = "https://ems-backendservice.onrender.com"; // Update to production URL as needed

const DashboardPage = () => {
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [redirectCountdown, setRedirectCountdown] = useState(5); // Countdown starts at 5
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    document.title = "EMS - DashBoard";
    const token = Cookies.get('token');

    if (token) {
      axios.post(`${SERVER_ADDRESS}/api/verify-token`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data.token !== token) {
          setShowRedirectMessage(true);
        } else {
          Cookies.set('name', response.data.name, { expires: 7, secure: true });
        }
      })
      .catch(() => {
        setShowRedirectMessage(true);
        Cookies.remove('token');
        Cookies.remove('email');
        Cookies.remove('name');
      })
      .finally(() => setLoading(false)); // End loading after API response
    } else {
      setShowRedirectMessage(true);
      setLoading(false); // End loading if token not found
    }
  }, []);

  useEffect(() => {
    let countdownInterval;

    if (showRedirectMessage) {
      countdownInterval = setInterval(() => {
        setRedirectCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownInterval);
            Cookies.remove('token');
            Cookies.remove('email');
            Cookies.remove('name');
            window.location.replace('/');  // Redirect to homepage
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [showRedirectMessage]);

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center">
      {loading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <BarLoader width={100} color="#ffffff" />
        </div>
      ) : showRedirectMessage ? (
        <div className="text-center text-white">
          <p>User not logged in. Redirecting to homepage in {redirectCountdown}...</p>
        </div>
      ) : (
        <h1 className="text-2xl text-white">Welcome to the Dashboard</h1>
      )}
    </div>
  );
};

export default DashboardPage;