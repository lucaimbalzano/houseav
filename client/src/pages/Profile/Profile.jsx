import { useSelector, useDispatch } from "react-redux";
import { IoCheckmarkDoneCircle, IoCreate } from "react-icons/io5";
import { MdPlaylistPlay } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";

import Spinner from "../../components/Spinner";
import YourListing from "../../components/YourListing";
import {
  handleDeleteUserLogic,
  handleFileUploadLogic,
  handleShowListingsLogic,
  handleSignOutLogic,
} from "./handleFunctions";
import ProfileInReview from "../../components/ProfileInReview";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState(undefined);
  const [fileProgression, setFileProgression] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [formDataUserUpdate, setFormDataUserUpdate] = useState({});

  console.log(currentUser);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    await handleFileUploadLogic(
      file,
      setFileProgression,
      setFileUploadError,
      setFormDataUserUpdate,
      formDataUserUpdate
    );
  };

  const handleChangeInput = (event) => {
    setFormDataUserUpdate({
      ...formDataUserUpdate,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataUserUpdate),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    await handleDeleteUserLogic(dispatch, currentUser);
  };

  const handleSignOut = async () => {
    await handleSignOutLogic(dispatch);
  };

  const handleShowListings = async (event) => {
    event.preventDefault();
    await handleShowListingsLogic(
      currentUser._id,
      setShowListingsError,
      setUserListings
    );
  };

  return (
    <div className="p-3 max-w-lg mx-auto h-screen">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      {currentUser.role.length > 1 ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(event) => setFile(event.target.files[0])}
          />
          <img
            src={formDataUserUpdate?.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
            onClick={() => fileRef.current.click()}
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : fileProgression > 0 && fileProgression < 100 ? (
              <span className="text-slate-400">{`Uploading ${fileProgression}%`}</span>
            ) : fileProgression === 100 ? (
              <span className="text-blue-300">Image successfully uploaded</span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            placeholder="username"
            defaultValue={currentUser.username}
            id="username"
            className="border p-3 rounded-lg"
            onChange={handleChangeInput}
          />
          <input
            type="email"
            placeholder="email"
            id="email"
            defaultValue={currentUser.email}
            className="border p-3 rounded-lg"
            onChange={handleChangeInput}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="border p-3 rounded-lg"
            onChange={handleChangeInput}
          />
          <button
            disabled={loading}
            className="w-full text-center mt-4 justify-center text-gray-900 font-semibold py-3 px-6 bg-gray-400 bg-opacity-50 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
          >
            {loading ? (
              <Spinner />
            ) : (
              <div className="flex gap-2">
                <IoCheckmarkDoneCircle className="text-2xl" />
                Update
              </div>
            )}
          </button>
          <Link
            className="w-full text-center mt-4 justify-center text-gray-900 font-semibold py-3 px-6 bg-gray-400 bg-opacity-50 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
            to={"/create-listing"}
          >
            <IoCreate className="text-2xl" />
            Create Listing
          </Link>
          <button
            type="button"
            onClick={(event) => handleShowListings(event)}
            className="w-full text-center mt-4 justify-center text-gray-900 font-semibold py-3 px-6 bg-gray-400 bg-opacity-50 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
          >
            <MdPlaylistPlay className="text-2xl" />
            Show Listings
          </button>
        </form>
      ) : (
        <ProfileInReview />
      )}

      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer flex items-center gap-2 hover:scale-105"
          onClick={handleDeleteUser}
        >
          <TiUserDelete />
          Delete account
        </span>
        <span
          className="text-blue-500 cursor-pointer flex items-center gap-2 hover:scale-105"
          onClick={handleSignOut}
        >
          <FaSignOutAlt />
          Sign out
        </span>
      </div>
      <div className="flex justify-center mt-5">
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-500 mt-5">
          {updateSuccess ? "Update Success" : ""}
        </p>
      </div>
      <div className="flex justify-center pb-10">
        <p className="text-red-700 mt-5">
          {showListingsError ? "Error showing listings" : ""}
        </p>
        <YourListing
          currentUser={currentUser}
          userListings={userListings}
          setUserListings={setUserListings}
        />
      </div>
    </div>
  );
}
