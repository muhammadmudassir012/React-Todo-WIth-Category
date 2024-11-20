import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Config/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../redux/DarkModeSlice";

export default function LoginPage() {
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const { mode } = useSelector((state) => state.darkMode);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmailText(e.target.value);
  const handlePasswordChange = (e) => setPasswordText(e.target.value);

  const login = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, emailText, passwordText)
      .then((userCredential) => {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
        }).then(() => {
          navigate("/"); 
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
        });
      });
  };
//   const { mode } = useSelector((state) => state.darkMode);

  useEffect(()=>{
  console.log(mode);
  
  })

  return (
    <div className={`flex items-center justify-center min-h-screen bg-darkGray`}>
      <div className="bg-darkGray shadow-black shadow-lg rounded-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-purplee text-center mb-6">Login</h1>

        <form onSubmit={login}>
          <div className="mb-4">
            <label className="block text-gray-100 font-semibold mb-1">Email</label>
            <input
              onChange={handleEmailChange}
              value={emailText}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-100 font-semibold mb-1">Password</label>
            <input
              onChange={handlePasswordChange}
              value={passwordText}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purplee text-white rounded-md hover:bg-darkPurple transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-100">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purplee hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
