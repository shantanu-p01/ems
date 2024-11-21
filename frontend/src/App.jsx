import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { Scrollbars } from "react-custom-scrollbars-2";
import BarLoader from "react-spinners/BarLoader"; // Import the loader

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Loading state for API call

  useEffect(() => {
    setLoading(false); // No need for any token validation anymore
  }, []);

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "grey", // Scrollbar color
      borderRadius: "2px",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  // List of routes where the footer should be hidden
  const hideFooterRoutes = ["/"];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <BarLoader width={100} color="#ffffff" />
      </div>
    );
  }

  return (
    <>
      {/* Fixed Navbar */}
      <Navbar />
      {/* Scrollable area starts below Navbar */}
      <div style={{ height: "100vh", paddingTop: "64px" }}>
        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          renderThumbVertical={renderThumb}
        >
          <div>
            <Routes>
              {/* Routes without authentication check */}
              {/* <Route path="/" element={<FirstPage />} /> */}
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          {/* Footer is displayed only if the current route is not in hideFooterRoutes */}
          {!hideFooterRoutes.includes(location.pathname) && <Footer />}
        </Scrollbars>
      </div>
    </>
  );
}

export default App;