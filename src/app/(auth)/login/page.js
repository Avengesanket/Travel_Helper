"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);
    if (res.ok) {
      const session = await getSession(); 
      if (session.user.isAdmin) {
        router.push("/adminPage");
      } else {
        router.push("/");
      }
    } else {
      setError(res.error || "Login failed. Please check your email and password.");
      console.error("Login failed:", res.error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl text-center font-bold mb-6">LOGIN</h1>
      
      <form onSubmit={handleSubmit} className="formstyle p-6 rounded-lg space-y-6">
        
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
            placeholder="••••••••"
            value={formData.password}
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
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "LOGIN"}
        </button>

        <p className="text-center text-sm">
          New User?{" "}
          <Link className="linkColor font-semibold" href="/signup">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;