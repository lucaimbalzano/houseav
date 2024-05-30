
// import { IoCheckmarkDoneCircle, IoCreate } from "react-icons/io5";
// import { MdPlaylistPlay } from "react-icons/md";
// import { FaSignOutAlt } from "react-icons/fa";
// import { TiUserDelete } from "react-icons/ti";
// import { CgProfile } from "react-icons/cg";

// export default function ProfileReviewed() {
//   return (
//     <>
//     <h1 className="text-3xl font-semibold my-7 flex items-center gap-2 justify-center">
//       <CgProfile />
//       Profile
//     </h1>
//     <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//       <input
//         type="file"
//         ref={fileRef}
//         hidden
//         accept="image/*"
//         onChange={(event) => setFile(event.target.files[0])}
//       />
//       <img
//         src={formDataUserUpdate?.avatar || currentUser.avatar}
//         alt="profile"
//         className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 hover:scale-105 shadow-lg hover:border-gray-400"
//         onClick={() => fileRef.current.click()}
//       />
//       <p className="text-sm self-center">
//         {fileUploadError ? (
//           <span className="text-red-700">
//             Error Image upload (image must be less than 2 mb)
//           </span>
//         ) : fileProgression > 0 && fileProgression < 100 ? (
//           <span className="text-slate-400">{`Uploading ${fileProgression}%`}</span>
//         ) : fileProgression === 100 ? (
//           <span className="text-blue-300">
//             Image successfully uploaded
//           </span>
//         ) : (
//           ""
//         )}
//       </p>
//       <input
//         type="text"
//         placeholder="username"
//         defaultValue={currentUser.username}
//         id="username"
//         className="border p-3 rounded-lg"
//         onChange={handleChangeInput}
//       />
//       <input
//         type="email"
//         placeholder="email"
//         id="email"
//         defaultValue={currentUser.email}
//         className="border p-3 rounded-lg"
//         onChange={handleChangeInput}
//       />
//       <input
//         type="password"
//         placeholder="password"
//         id="password"
//         className="border p-3 rounded-lg"
//         onChange={handleChangeInput}
//       />
//       <button
//         disabled={loading}
//         className="w-full text-center mt-4 justify-center text-gray-900 font-semibold py-3 px-6 bg-gray-400 bg-opacity-50 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
//       >
//         {loading ? (
//           <Spinner />
//         ) : (
//           <div className="flex gap-2">
//             <IoCheckmarkDoneCircle className="text-2xl" />
//             Update
//           </div>
//         )}
//       </button>
//       <Link
//         className="w-full text-center mt-4 justify-center text-gray-900 font-semibold py-3 px-6 bg-gray-400 bg-opacity-50 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
//         to={"/create-listing"}
//       >
//         <IoCreate className="text-2xl" />
//         Create Listing
//       </Link>
//       <button
//         type="button"
//         onClick={(event) => handleShowListings(event)}
//         className="w-full text-center mt-4 justify-center text-gray-900 font-semibold py-3 px-6 bg-gray-400 bg-opacity-50 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
//       >
//         <MdPlaylistPlay className="text-2xl" />
//         Show Listings
//       </button>
//     </form>
//     <div className="flex justify-between mt-5">
//       <span
//         className="text-red-700 cursor-pointer flex items-center gap-2 hover:scale-105"
//         onClick={() => handleOpenCartClick("delete")}
//       >
//         <TiUserDelete />
//         Delete account
//       </span>
//       <span
//         className="text-blue-500 cursor-pointer flex items-center gap-2 hover:scale-105"
//         onClick={() => handleOpenCartClick("signout")}
//       >
//         <FaSignOutAlt />
//         Sign out
//       </span>
//     </div>
//   </>
//   )
// }
