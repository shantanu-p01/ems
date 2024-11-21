import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import FirstPage from "./components/FirstPage.jsx";
import { Scrollbars } from 'react-custom-scrollbars-2';

function App() {
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: 'grey', // Scrollbar color
      borderRadius: '2px',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  return (
    <>
      {/* Fixed Navbar */}
      <Navbar />
      {/* Scrollable area starts below Navbar */}
      <div style={{ height: '100vh', paddingTop: '66px' }}>
        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          renderThumbVertical={renderThumb}
        >
          <div>
            <Routes>
              {/* <Route path="/" element={<FirstPage />} /> */}
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
          {/* Footer included in the scrollable content */}
          <Footer />
        </Scrollbars>
      </div>
    </>
  );
}

export default App;
