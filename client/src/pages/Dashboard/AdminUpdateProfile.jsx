import React, { useState, useEffect} from "react";
import Spinner from "../../components/Spinner";
import { IoCheckmarkDoneCircle, IoCreate } from "react-icons/io5";
import { Link } from "react-router-dom";
import { formattedDate } from "../../../utils/utils";
import Toggle from "../../components/Toggle";
import SecurityEnDe from "../../../utils/security_en_de"


export default function AdminUpdateProfile({ user, setUser }) {
  const [loading, setLoading] = useState(false); // Define loading state
  const [userVerified, setUserVerified] = useState(user?.verified?? false);
  const handleChangeInput = (event) => {
    const { id, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [id]: value,
    }));
    console.log('USER INPUT CHANGES:::\n'+JSON.stringify(user))
  };

  const handleUpdateSingleProfile = async (e) => {
    e.preventDefault();
    setLoading(true)
    const sec = new SecurityEnDe();
    sec.testAesGcm();
  }

  useEffect(() => {
    console.log("USER VERIFIED::::"+userVerified);
    if(user) user.verified = userVerified;
  }, [userVerified]);

  return (
    <div>
      {user ? (
        <div>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="username"
              defaultValue={user.username}
              id="username"
              className="border p-3 rounded-lg"
              onChange={handleChangeInput}
            />
            <input
              type="email"
              placeholder="email"
              id="email"
              defaultValue={user.email}
              className="border p-3 rounded-lg"
              onChange={handleChangeInput}
            />
            <input
              type="text"
              placeholder="url image"
              id="image"
              defaultValue={user.avatar}
              className="border p-3 rounded-lg"
              onChange={handleChangeInput}
            />
            <input
              type="date"
              placeholder="created at"
              id="createdAt"
              defaultValue={formattedDate(user.createdAt)}
              className="border p-3 rounded-lg"
              onChange={handleChangeInput}
            />
            <input
              type="date"
              placeholder="updated at"
              id="updateAt"
              defaultValue={formattedDate(user.updatedAt)}
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
            <input
              type="text"
              placeholder="social"
              defaultValue={user.social}
              id="social"
              className="border p-3 rounded-lg"
              onChange={handleChangeInput}
            />
            <input
              type="text"
              placeholder="number"
              defaultValue={user.number}
              id="number"
              className="border p-3 rounded-lg"
              onChange={handleChangeInput}
            />
            <div className="flex justify-end space-x-2 m-2">
            { userVerified ? <p className="text-green-500">Verified</p> : <p className="text-red-500">To Verify</p>}
            <Toggle verified={userVerified} onVerifiedChange={setUserVerified} />
            </div>
            <button
              onClick={handleUpdateSingleProfile}
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
          </form>
        </div>
      ) : (<>
            <p>No data retrieved</p>
            <Spinner />
           </>
          )}
    </div>
  );
}
