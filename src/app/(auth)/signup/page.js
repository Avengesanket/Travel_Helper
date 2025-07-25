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
    <div className="w-2/5 m-auto">
      <h1 className="text-2xl text-center font-bold mb-4">SIGNUP</h1>
      <form
        className="formstyle container mt-10 max-w-md mx-auto bg-white p-6 rounded-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`btn text-white text-sm px-5 py-2.5 font-bold focus:outline-none rounded-lg mt-4 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : 'CREATE ACCOUNT'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <p>
            Already have an account?{' '}
            <Link className="linkColor ml-4 font-semibold" href="/login">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;


