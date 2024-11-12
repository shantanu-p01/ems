import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const SERVER_ADDRESS = "https://ems-backendservice.onrender.com"; // Update to production URL as needed

const DashboardPage = () => {
  const [redirectCountdown, setRedirectCountdown] = useState(5); // Countdown starts at 5
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    // Set the document title when the component mounts
    document.title = "EMS - DashBoard";

    const token = Cookies.get('token');

    if (token) {
      axios.post(`${SERVER_ADDRESS}/api/verify-token`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data.token !== token) {
          // Tokens don't match, start logout and countdown
          setShowRedirectMessage(true);
        } else {
          // Tokens match, set the name in the cookie and allow access to the dashboard
          Cookies.set('name', response.data.name, { expires: 7, secure: true });
        }
      })
      .catch(() => {
        // Verification failed, start logout and countdown
        setShowRedirectMessage(true);
        Cookies.remove('token'); 
        Cookies.remove('email'); 
        Cookies.remove('name'); 
      });
    } else {
      // No token found, show redirect message
      setShowRedirectMessage(true);
    }
  }, []);

  useEffect(() => {
    let countdownInterval;

    if (showRedirectMessage) {
      countdownInterval = setInterval(() => {
        setRedirectCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownInterval);
            // Clear cookies and redirect to homepage
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
      {showRedirectMessage ? (
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