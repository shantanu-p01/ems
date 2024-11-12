import { HiMenu } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  // Function to toggle the drawer visibility
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  // Function to close the drawer
  const closeDrawer = () => setIsDrawerOpen(false);

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path ? "scale-110 text-yellow-500" : "text-white";

  // When the drawer is open, disable body scrolling
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "auto";
    if (isDrawerOpen) window.scrollTo({ top: 0, behavior: "smooth" });
    return () => document.body.style.overflow = "auto";
  }, [isDrawerOpen]);

  return (
    <>
      <header className="fixed w-screen h-16 select-none z-10">
        <nav className="w-full bg-[#212121] h-16 px-4 sm:pr-8 flex items-center justify-between">
          {/* Left side (logo) */}
          <h1 className="p-2 MonoBold rounded-lg text-4xl transition-all duration-300 hover:scale-110 cursor-pointer">E-M-S</h1>

          {/* Right side (desktop links) */}
          <div className="hidden sm:flex items-center justify-evenly gap-4 text-lg">
            {["/", "/dashboard", "/profile"].map(path => (
              <NavLink key={path} to={path} className={`transition-all capitalize duration-300 cursor-pointer hover:font-semibold ${isActive(path)}`}>
                {path === "/" ? "Home" : path.slice(1)}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <HiMenu size="34" onClick={toggleDrawer} className="cursor-pointer sm:hidden" />
        </nav>
      </header>

      {/* Drawer overlay */}
      {isDrawerOpen && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm sm:hidden" onClick={toggleDrawer} />}

      {/* Drawer menu */}
      <div className={`sm:hidden fixed top-0 left-0 w-64 h-full bg-slate-700 text-white p-8 transform transition-transform duration-300 flex items-start flex-col pt-20 gap-5 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {["/", "/dashboard", "/profile"].map(path => (
          <NavLink key={path} to={path} className={`cursor-pointer capitalize ${isActive(path)}`} onClick={closeDrawer}>
            {path === "/" ? "Home" : path.slice(1)}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Navbar;