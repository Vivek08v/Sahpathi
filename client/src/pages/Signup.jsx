import React, { useState } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { signUpAPI } from '../services/operations/auth.service';
import { useDispatch } from 'react-redux';

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    image: '',
    password: '',
    confirmPassword: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if(e.target.name === "image"){
      const file = e.target.files[0];
      if (!file) return;

      // setImage(file);
      setFormData({...formData, [e.target.name]: file});
      setPreview(URL.createObjectURL(file)); // create preview URL
    }
    else{
      setFormData({...formData, [e.target.name]: e.target.value});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to be added here
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    dispatch(signUpAPI(data, navigate));
    console.log("User going to Signed Up:", data);
    navigate("/")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 to-amber-400">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-amber-600 mb-6">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label>
              Upload Picture:
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </label>
            {preview && (
              <div>
                <img src={preview} alt="Preview"/>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-md transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <NavLink to="/login" className="text-amber-600 hover:underline">
            Log in
          </NavLink>
        </p>
      </div>
    </div>
  );
}