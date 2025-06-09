import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/profile-picture/logo.jpg";
import { navItems } from "../../constant";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className=" sticky top-0 z-50 py-3 bg-[rgb(18,18,62)] backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo + Nav Links on Left */}
          <div className="flex items-center space-x-10">
            <img className="h-10 w-15 mr-2" src={logo} alt="Logo" />
            <ul className="hidden lg:flex space-x-8">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sign In / Create Account on Right */}
          <div className="hidden lg:flex justify-center space-x-4 items-center">
            <a href="/login" className="py-2 px-3 border rounded-md from-orange-500 to-orange-800 bg-gradient-to-r">
              Sign In
            </a>
            <a
              href="/register"
              className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md border"
            >
              Create an account
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div className="lg:hidden md:flex flex-col justify-end">
          <button onClick={toggleNavbar}>
            {mobileDrawerOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {mobileDrawerOpen && (
        <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
          <ul>
            {navItems.map((item, index) => (
              <li key={index} className="py-4">
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <div className="flex space-x-6">
            <a href="#" className="py-2 px-3 border rounded-md">
              Sign In
            </a>
            <a
              href="#"
              className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800"
            >
              Create an account
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;