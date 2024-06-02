import { useSelector, useDispatch } from "react-redux";
import { IoCheckmarkDoneCircle, IoCreate } from "react-icons/io5";
import { MdPlaylistPlay } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";
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
import ProfileInReview from "./ProfileInReview";
import ProfileModal from "../../components/Modal";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState(undefined);
  const [fileProgression, setFileProgression] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState();
  const [formDataUserUpdate, setFormDataUserUpdate] = useState({});
  const [modalInformations, setModalInformations] = useState({});
  const modal = useRef();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleOpenCartClick = (buttonName) => {
    if (buttonName === "delete")
      setModalInformations({
        title: "Attention",
        description: `Hey, ${currentUser.user.username}, are you sure you want to delete the account?`,
        actions: modalActions("Delete", "bg-red-600", handleDeleteUser),
      });

    if (buttonName === "signout")
      setModalInformations({
        title: "Sign Out",
        description: "Are you sure you want to sign out?",
        actions: modalActions("Sign Out", "bg-blue-400", handleSignOut),
      });

    modal.current.open();
  };

  var modalActions = (nameButton, bgColorButton, functionToCall) => (
    <>
      <button
        className={`inline-flex w-full justify-center rounded-md ${bgColorButton} px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto`}
        onClick={functionToCall}
      >
        {nameButton}
      </button>
      <button className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
        Close
      </button>
    </>
  );

  const handleFileUpload = async (file) => {
    await handleFileUploadLogic(
      file,
      setFileProgression,
      setFileUploadError,
      setFormDataUserUpdate,
      formDataUserUpdate
    );
  };

  // const handleChangeInput = (event) => {
  //   setFormDataUserUpdate({
  //     ...formDataUserUpdate,
  //     [event.target.id]: event.target.value,
  //   });
  // };

  const handleChangeInput = (event) => {
    const { id, value } = event.target;
    setFormDataUserUpdate((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/user/${currentUser.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${currentUser.access_token}`
        },
        body: JSON.stringify(formDataUserUpdate),
      });
      const acceptableStatusCodes = [200, 201, 202];
      if (!acceptableStatusCodes.includes(res.status)) {
        dispatch(updateUserFailure("Error while updating user"));
        return;
      }
      const data = await res.json();
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
    localStorage.clear();
    window.location.reload();

    // await handleSignOutLogic(dispatch);
  };

  const handleShowListings = async (event) => {
    event.preventDefault();
    await handleShowListingsLogic(
      currentUser.user.id,
      setShowListingsError,
      setUserListings
    );
  };

  return (
    <div className="p-3 max-w-lg mx-auto h-screen">
      <ProfileModal
        ref={modal}
        title={modalInformations.title || ""}
        descriptions={modalInformations.description || ""}
        actions={modalInformations.actions || ""}
      />
      {currentUser.user.fkRoleId ? (
        <>
          <h1 className="text-3xl font-semibold my-7 flex items-center gap-2 justify-center">
            <CgProfile />
            Profile
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={(event) => setFile(event.target.files[0])}
            />
            <img
              src={formDataUserUpdate?.avatar || currentUser.user.avatar}
              alt="profile"
              className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 hover:scale-105 shadow-lg hover:border-gray-400"
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
                <span className="text-blue-300">
                  Image successfully uploaded
                </span>
              ) : (
                ""
              )}
            </p>
            <input
              type="text"
              placeholder="username"
              defaultValue={currentUser.user.username}
              id="username"
              className="border p-3 rounded-lg"
              onChange={handleChangeInput}
            />
            <input
              type="email"
              placeholder="email"
              id="email"
              defaultValue={currentUser.user.email}
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
          <div className="flex justify-between mt-5">
            <span
              className="text-red-700 cursor-pointer flex items-center gap-2 hover:scale-105"
              onClick={() => handleOpenCartClick("delete")}
            >
              <TiUserDelete />
              Delete account
            </span>
            <span
              className="text-blue-500 cursor-pointer flex items-center gap-2 hover:scale-105"
              onClick={() => handleOpenCartClick("signout")}
            >
              <FaSignOutAlt />
              Sign out
            </span>
          </div>
        </>
      ) : (
        <ProfileInReview />
      )}

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
