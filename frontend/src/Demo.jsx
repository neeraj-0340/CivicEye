import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const DemoApp = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulated user fetch (replace with actual API call)
  useEffect(() => {
    const fetchUser = async () => {
      // Replace with actual API call to fetch user data
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark:bg-gray-900" : "bg-gray-50"}`}>
      <Toaster />
      {/* Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="mx-auto flex items-center justify-between py-4 px-6 max-w-7xl">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Nestora
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-6 text-gray-700 dark:text-gray-300 font-medium">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Home
            </Link>
            <Link to="/properties/sale" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Properties for Sale
            </Link>
            <Link to="/properties/rent" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Properties for Rent
            </Link>
            <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Contact
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button type="submit" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* User Section and Additional Features */}
          <div className="flex items-center space-x-4">
            {/* Sell a Property Button */}
            <Link
              to="/sell"
              className="hidden md:inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Sell a Property
            </Link>

            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-300">
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Language Switcher */}
            <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 dark:bg-gray-700 dark:text-white">
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
            </select>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium hidden md:block">
                    {user.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500 dark:text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-listings"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/saved-properties"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                    >
                      Saved Properties
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Hamburger Menu (Mobile) */}
            <button
              className="md:hidden text-gray-700 dark:text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
            <nav className="flex flex-col items-start space-y-2 px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
              <Link
                to="/"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/properties/sale"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Properties for Sale
              </Link>
              <Link
                to="/properties/rent"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Properties for Rent
              </Link>
              <Link
                to="/about"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/sell"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sell a Property
              </Link>
              <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 w-full focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button type="submit" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 h-96">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-6">
            <h1 className="text-4xl font-bold mb-4">Find Your Dream Home with Nestora</h1>
            <p className="text-xl mb-8">Explore luxurious properties for sale and rent across the globe.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/properties/sale"
                className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                Browse Properties for Sale
              </Link>
              <Link
                to="/properties/rent"
                className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-700 font-medium py-3 px-6 rounded-lg transition-all duration-300"
              >
                Browse Properties for Rent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="container mx-auto py-16 px-6">
        <h3 className="text-center text-3xl font-bold mb-12 text-gray-800 dark:text-gray-200">
          Featured Properties
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sample Property Card */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Property"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Modern Villa in Beverly Hills
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                4 Beds • 3 Baths • 3,200 sqft
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-bold mt-2">$1,250,000</p>
              <Link
                to="/property/1"
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                View Details
              </Link>
            </div>
          </div>
          {/* Add more property cards as needed */}
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-blue-50 dark:bg-gray-700 py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-center text-3xl font-bold mb-12 text-gray-800 dark:text-gray-200">
            About Nestora
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Nestora is your trusted partner in finding the perfect home. We connect buyers, sellers, and renters with premium properties worldwide, offering a seamless and personalized experience.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 pt-12 pb-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="mb-8">
              <h5 className="text-lg font-semibold text-white mb-4">Nestora</h5>
              <p className="text-sm text-gray-400">
                Connecting you to your dream home, anywhere in the world.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-white mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-blue-400 transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/properties/sale" className="hover:text-blue-400 transition-colors duration-200">
                    Properties for Sale
                  </Link>
                </li>
                <li>
                  <Link to="/properties/rent" className="hover:text-blue-400 transition-colors duration-200">
                    Properties for Rent
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-blue-400 transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-400 transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-white mb-4">Contact Info</h5>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+1 (123) 456-7890</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>support@nestora.com</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-white mb-4">Stay Connected</h5>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                >
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                >
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                >
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.066-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
            <p>© Nestora 2025 | All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoApp;