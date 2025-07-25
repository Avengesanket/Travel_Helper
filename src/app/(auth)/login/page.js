"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Correct usage

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
      const session = await getSession(); // Fetch session after successful login
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
    <div className="w-2/5 mx-auto">
      <h1 className="text-2xl text-center font-bold mb-4">LOGIN</h1>
      <form onSubmit={handleSubmit} className="formstyle container mt-10 max-w-md mx-auto bg-white p-6 rounded-md">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500"
              />
          </div>
          
          <div className="flex justify-between items-center">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`btn text-white text-sm px-5 py-2.5 font-bold focus:outline-none rounded-lg mt-4 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "SUBMIT"}
          </button>
          <p>
            New User?{" "}
            <Link className="linkColor font-semibold" href="/signup">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
