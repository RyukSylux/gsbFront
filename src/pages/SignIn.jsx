import React from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold">Logo</div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
        <p className="text-gray-600 mb-6">Welcome back! Please enter your details.</p>
        <form>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" placeholder="Enter your email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />

          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-600">Remember for 30 days</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password</a>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md mt-6 hover:bg-indigo-700">Sign in</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account? <Link to="/" className="text-indigo-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
