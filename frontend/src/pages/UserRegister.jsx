import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {saveAccessToken} from "../helper/Token.js"


export default function UserRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // 🔥 Create payload according to backend requirement
    const payload = {
      fullname: {
        firstname: formData.firstName,
        lastname: formData.lastName,
      },
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/users/register",
        payload
      );

      setSuccessMsg("Account created successfully!");
      saveAccessToken(res.data.token);
      navigate("/login")

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      });

    } catch (error) {
      console.log(error);
      setErrorMsg(
        error?.response?.data?.message || "Something went wrong. Try again!"
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* NAVBAR */}
      <nav className="w-full bg-black text-white px-6 py-4 flex items-center">
        <div className="text-2xl font-bold tracking-tight">Uber</div>
      </nav>

      {/* FORM CONTAINER */}
      <div className="max-w-md mx-auto mt-14 px-6">
        <form
          onSubmit={handleSubmit}
          className="border border-gray-300 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-3xl font-semibold mb-2">Create your account</h2>
          <p className="text-gray-600 mb-8">Sign up to get started</p>

          {/* FIRST NAME */}
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* LAST NAME */}
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <p className="text-red-600 mb-3 text-sm">{errorMsg}</p>
          )}

          {/* SUCCESS MESSAGE */}
          {successMsg && (
            <p className="text-green-600 mb-3 text-sm">{successMsg}</p>
          )}

          {/* SIGN UP BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg text-lg font-medium hover:bg-gray-900 transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
