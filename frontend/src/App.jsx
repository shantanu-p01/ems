import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual'; // Disable default scroll restoration

    const handleLoadingState = () => {
      setLoading(true);
      document.body.style.overflow = 'hidden'; // Prevent scrolling while loading
      document.body.style.paddingRight = '16px'; // Adjust for scrollbar width
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const timer = setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = 'auto'; // Restore normal scroll
        document.body.style.paddingRight = '0';
      }, 1000); // Simulate 1-second loading time

      return () => clearTimeout(timer);
    };

    handleLoadingState();
  }, [location]);

  return (
    <>
      <Navbar />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <BarLoader width={100} color="#ffffff" />
        </div>
      )}
      <div className={loading ? "invisible" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;