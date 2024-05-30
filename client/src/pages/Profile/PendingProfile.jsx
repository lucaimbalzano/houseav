// import { useSelector, useDispatch } from "react-redux";
// import { useRef, useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// import {
//   updateUserFailure,
//   updateUserStart,
//   updateUserSuccess,
// } from "../../redux/user/userSlice";

// import Spinner from "../../components/Spinner";
// import YourListing from "../../components/YourListing";
// import {
//   handleDeleteUserLogic,
//   handleFileUploadLogic,
//   handleShowListingsLogic,
//   handleSignOutLogic,
// } from "./handleFunctions";
// import ProfileInReview from "./ProfileInReview";
// import ProfileModal from "../../components/Modal";

// export default function Profile() {
//   const { currentUser, loading, error } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const fileRef = useRef(null);
//   const [updateSuccess, setUpdateSuccess] = useState(false);
//   const [file, setFile] = useState(undefined);
//   const [fileProgression, setFileProgression] = useState(0);
//   const [fileUploadError, setFileUploadError] = useState(false);
//   const [showListingsError, setShowListingsError] = useState(false);
//   const [userListings, setUserListings] = useState();
//   const [formDataUserUpdate, setFormDataUserUpdate] = useState({});
//   const [modalInformations, setModalInformations] = useState({});
//   const modal = useRef();

//   useEffect(() => {
//     if (file) {
//       handleFileUpload(file);
//     }
//   }, [file]);

//   const handleOpenCartClick = (buttonName) => {
//     if (buttonName === "delete")
//       setModalInformations({
//         title: "Attention",
//         description: `Hey, ${currentUser.username}, are you sure you want to delete the account?`,
//         actions: modalActions("Delete", "bg-red-600", handleDeleteUser),
//       });

//     if (buttonName === "signout")
//       setModalInformations({
//         title: "Sign Out",
//         description: "Are you sure you want to sign out?",
//         actions: modalActions("Sign Out", "bg-blue-400", handleSignOut),
//       });

//     modal.current.open();
//   };

//   var modalActions = (nameButton, bgColorButton, functionToCall) => (
//     <>
//       <button
//         className={`inline-flex w-full justify-center rounded-md ${bgColorButton} px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto`}
//         onClick={functionToCall}
//       >
//         {nameButton}
//       </button>
//       <button className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
//         Close
//       </button>
//     </>
//   );

//   const handleFileUpload = async (file) => {
//     await handleFileUploadLogic(
//       file,
//       setFileProgression,
//       setFileUploadError,
//       setFormDataUserUpdate,
//       formDataUserUpdate
//     );
//   };

//   const handleChangeInput = (event) => {
//     setFormDataUserUpdate({
//       ...formDataUserUpdate,
//       [event.target.id]: event.target.value,
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       dispatch(updateUserStart());
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formDataUserUpdate),
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(updateUserFailure(data.message));
//         return;
//       }
//       dispatch(updateUserSuccess(data));
//       setUpdateSuccess(true);
//     } catch (error) {
//       dispatch(updateUserFailure(error.message));
//     }
//   };

//   const handleDeleteUser = async () => {
//     await handleDeleteUserLogic(dispatch, currentUser);
//   };

//   const handleSignOut = async () => {
//     await handleSignOutLogic(dispatch);
//   };

//   const handleShowListings = async (event) => {
//     event.preventDefault();
//     await handleShowListingsLogic(
//       currentUser._id,
//       setShowListingsError,
//       setUserListings
//     );
//   };

//   return (
//     <div className="p-3 max-w-lg mx-auto h-screen">
//       <ProfileModal
//         ref={modal}
//         title={modalInformations.title || ""}
//         descriptions={modalInformations.description || ""}
//         actions={modalInformations.actions || ""}
//       />
//         <ProfileInReview />
//       <div className="flex justify-center mt-5">
//         <p className="text-red-700 mt-5">{error ? error : ""}</p>
//         <p className="text-green-500 mt-5">
//           {updateSuccess ? "Update Success" : ""}
//         </p>
//       </div>
//       <div className="flex justify-center pb-10">
//         <p className="text-red-700 mt-5">
//           {showListingsError ? "Error showing listings" : ""}
//         </p>
//         <YourListing
//           currentUser={currentUser}
//           userListings={userListings}
//           setUserListings={setUserListings}
//         />
//       </div>
//     </div>
//   );
// }
