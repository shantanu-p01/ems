import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // to detect route changes

  // Handle scroll restoration (for backward navigation)
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  // Add or remove 'no-scroll' class when loading state changes
  useEffect(() => {
    if (loading) {
      document.body.classList.add("no-scroll", "pr-3");
    } else {
      document.body.classList.remove("no-scroll", "pr-3");
    }
  }, [loading]);

  // Whenever the route changes, set loading to true and scroll to the top smoothly
  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // This ensures smooth scrolling to the top
    });
  }, [location]);

  // Simulate page loading time with a timeout, then hide the loader
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); // Simulate a loading time of 1 second (adjust as needed)
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <>
      <Navbar />
      
      {/* Show the loader when loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <BarLoader width={100} color="#ffffff" />
        </div>
      )}

      {/* Render the routes */}
      <div className={loading ? "invisible" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;