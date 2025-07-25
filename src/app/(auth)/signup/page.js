'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.status === 201) {
        router.push('/login');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl text-center font-bold mb-6">CREATE AN ACCOUNT</h1>
      
      {/* The `formstyle` class from globals.css will handle the card look */}
      <form onSubmit={handleSubmit} className="formstyle p-6 rounded-lg space-y-6">

        {/* Full Name Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="fullName" className="font-medium text-gray-700 dark:text-gray-300">
            Full Name:
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="w-full py-3 px-4 border border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300">
            Email:
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full py-3 px-4 border border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-300">
            Password:
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full py-3 px-4 border border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="confirmPassword" className="font-medium text-gray-700 dark:text-gray-300">
            Confirm Password:
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className="w-full py-3 px-4 border border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`btn w-full text-base px-5 py-3 font-bold focus:outline-none rounded-lg mt-4 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
        </button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link className="linkColor font-semibold" href="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;


