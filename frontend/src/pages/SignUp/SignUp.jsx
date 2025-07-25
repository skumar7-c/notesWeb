import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { validateEmail } from "../../utils/helper";
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Reset errors
    let tempErrors = {};
    if (!name) tempErrors.name = "Please enter your name";
    if (!validateEmail(email)) tempErrors.email = "Please enter a valid email";
    if (!password) tempErrors.password = "Please enter your password";

    setErrors(tempErrors);
    setApiError("");

    if (Object.keys(tempErrors).length > 0) return;

    try {
      setLoading(true);

      const response = await axiosInstance.post("/create-account", {
        fullName:name.trim(),
        email: email.trim(),
        password: password,
      });

      if (response.data?.message && !response.data?.accessToken) {
        setApiError(response.data.message);
        setLoading(false);
        return;
      }

      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate('/dashboard');
      }

    } catch (error) {
              console.error("Signup error:", error); // 👈 Add this

      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp} noValidate>
            <h4 className="text-2xl mb-7">Sign Up</h4>

            <input
              type="text"
              placeholder="Enter your name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

            <input
              type="email"
              placeholder="Enter your email"
              className="input-box mt-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

            {apiError && <p className="text-red-600 text-sm mt-2">{apiError}</p>}

            <button
              type="submit"
              className="btn-primary mt-4 w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
