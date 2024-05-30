import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import Spinner from "../components/Spinner";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleChange = (event) => {
  //   setFormData((prevFormData) => {
  //     const updateFormData = { ...prevFormData, formData };
  //     return {
  //       ...updateFormData,
  //       [event.target.id]: event.target.value,
  //     };
  //   });
  // };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  // const getRoleNamesByRoleId = async (role) => {
  //   try {
  //     dispatch(signInStart());
  //     const res = await fetch("/api/user/roles", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ role }),
  //     });
  //     const data = await res.json();
  //     if (data.success == false) {
  //       dispatch(signInFailure(data.message));
  //       return null;
  //     }
  //     return data;
  //   } catch (error) {
  //     dispatch(signInFailure(error.message));
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      const acceptableStatusCodes = [200, 201, 202];
      if (!acceptableStatusCodes.includes(res.status)) {
        dispatch(signInFailure(data.message));
        return;
      }
      // var roleNames = await getRoleNamesByRoleId(data.role);
      // if (!roleNames) dispatch(signInFailure(roleNames));
      // data.fkRole = roleNames;
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 mt-14 max-w-lg mx-auto h-screen">
      <h1 className="text-3xl text-center font-semibold my-7">Welcome back</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg "
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
          className="w-full text-center mt-4 justify-center text-gray-900 py-3 px-6 bg-gray-400 bg-opacity-50 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
        >
          {loading ? <Spinner /> : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>

        <Link to={"/sign-up"}>
          <span className="text-blue-600">Sign up</span>
        </Link>
      </div>
      {error && <span className="text-xl text-red-600">{error}</span>}
    </div>
  );
}
