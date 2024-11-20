import React, { useEffect, useState } from 'react';
import { auth } from '../Config/FirebaseConfig'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../redux/DarkModeSlice';

const Navbar = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

  const { mode } = useSelector((state) => state.darkMode);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate()

  const logout = () => {
    signOut(auth).then(() => {
      console.log("Sign-out successful.");
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
      });
      navigate('/')
  }).catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Logout Failed",
      text: error.message,
    });
      console.log('Logout Error',error);
  });
  }

  const [authentication, setAuthentication] = useState(true)
  useEffect(()=> {
    check()
  },[authentication])
  const check = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
        console.log("user signed in");
        setAuthentication(true)
      } else {
        console.log("user signed out");
        setAuthentication(false)
      }
    });
  }

  return (
    <header className={`${mode ? "bg-darkGrays" : "bg-gray-50"} shadow-lg shadow-black`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className={`text-2xl font-bold ${mode ? "text-white" : "text-black"}`}>
          Todo Website
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a onClick={(e) => {e.preventDefault();navigate('/')}} href="#home"  className={`${mode ? "text-white" : "text-black"} hover:text-purplee`}>
            Home
          </a>
          <a  onClick={(e) => {
              e.preventDefault();               if (authentication) {
                logout(); 
              } else {
                navigate("/login"); 
              }
            }} 
            href="#services"
             className={`${mode ? "text-white" : "text-black"} hover:text-purplee`}>
          {authentication ? "Logout" : "Login"}
          </a>
          <div className=''>
          <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`${mode ? "text-white" : "text-black"} hover:text-purplee`}
            >
              {mode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden bg-gray-50 border-t border-gray-200">
          <a href="#home" className="block px-4 py-2 text-gray-600 hover:bg-indigo-100">
            Home
          </a>
          <a  onClick={(e) => {
              e.preventDefault(); 
              if (authentication) {
                logout(); 
              } else {
                navigate("/login"); 
              }
            }} 
            href="#services"
             className="text-gray-600 hover:text-indigo-600">
          {authentication ? "Logout" : "Login"}
          </a>
          <button
              onClick={() => dispatch(toggleDarkMode())}
              className="text-gray-600 hover:text-indigo-600"
            >
              {mode ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
