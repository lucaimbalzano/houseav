import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import Spinner from "../components/Spinner";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.id]: event.target.value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const res = await fetch("/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const acceptableStatusCodes = [200, 201, 202];
    if (!acceptableStatusCodes.includes(res.status)) {
      setLoading(false);
      // setError(data.message);
      return;
    }
    // const data = await res.json();
    setError(null);
    setLoading(false);
    navigate("/sign-in");
  };

  return (
    <div className="p-3 mt-14 max-w-lg mx-auto h-screen">
      <h1 className="text-3xl text-center font-semibold my-7">
        Create an account
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full text-center mt-4 justify-center text-gray-900 font-semibold py-3 px-6 bg-gray-400 bg-opacity-50 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
        >
          {loading ? <Spinner /> : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>

        <Link to={"/sign-in"}>
          <span className="text-blue-600">Sign in</span>
        </Link>
      </div>
      {error && <span className="text-xl text-red-600">{error}</span>}
    </div>
  );
}
