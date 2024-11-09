import { HiMenu } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom"; // Import NavLink from react-router-dom

const Navbar = () => {
  // State to track if the drawer is open or closed
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to toggle the drawer visibility
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Get the current location (path) from react-router-dom
  const location = useLocation();

  // Check if the current path matches a specific route
  const isHomePage = location.pathname === "/";
  const isDashboardPage = location.pathname === "/dashboard";
  const isContactPage = location.pathname === "/contact";

  // When the drawer is open, disable body scrolling
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Scroll smoothly to the top
      });
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling again
    }
    return () => {
      document.body.style.overflow = "auto"; // Ensure scrolling is enabled when component unmounts
    };
  }, [isDrawerOpen]);

  return (
    <>
      <header className="fixed w-screen h-16 select-none z-10">
        <nav className="w-full bg-slate-500 h-16 px-4 md:pr-8 flex items-center justify-between">
          {/* Nav Left */}
          <div className="w-fit">
            <h1 className="p-2 rounded-lg text-4xl transition-all duration-300 hover:scale-110 cursor-pointer">EMS</h1>
          </div>

          {/* Nav Right PC */}
          <div className="w-fit hidden md:flex items-center justify-evenly gap-4 text-lg">
            {/* Use NavLink for active link styling */}
            <NavLink
              to="/"
              className={`transition-all duration-300 cursor-pointer hover:font-semibold ${
                isHomePage ? "scale-110 text-yellow-500" : "text-white"
              }`}
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className={`transition-all duration-300 cursor-pointer hover:font-semibold ${
                isDashboardPage ? "scale-110 text-yellow-500" : "text-white"
              }`}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/contact"
              className={`transition-all duration-300 cursor-pointer hover:font-semibold ${
                isContactPage ? "scale-110 text-yellow-500" : "text-white"
              }`}
            >
              Contact
            </NavLink>
          </div>

          {/* Nav Left Mobile */}
          <div className="w-fit md:hidden">
            <HiMenu size="34" onClick={toggleDrawer} className="cursor-pointer" />
          </div>
        </nav>
      </header>

      {/* Drawer */}
      {/* Overlay that is only visible when the drawer is open */}
      {isDrawerOpen && (
        <div
          className="fixed select-none top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm md:hidden"
          onClick={toggleDrawer} // Close the drawer when clicking outside
        />
      )}

      {/* Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 w-64 h-full bg-slate-700 text-white p-8 transform transition-transform duration-300 flex items-start flex-col pt-20 gap-5 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Use NavLink for active link styling */}
        <NavLink
          to="/"
          className={`cursor-pointer ${isHomePage ? "scale-110 text-yellow-500" : "text-white"}`}
          onClick={closeDrawer} // Close drawer when link is clicked
        >
          Home
        </NavLink>
        <NavLink
          to="/dashboard"
          className={`cursor-pointer ${isDashboardPage ? "scale-110 text-yellow-500" : "text-white"}`}
          onClick={closeDrawer} // Close drawer when link is clicked
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/contact"
          className={`cursor-pointer ${isContactPage ? "scale-110 text-yellow-500" : "text-white"}`}
          onClick={closeDrawer} // Close drawer when link is clicked
        >
          Contact
        </NavLink>
      </div>
    </>
  );
};

export default Navbar;
