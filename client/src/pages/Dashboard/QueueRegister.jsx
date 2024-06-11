import { useEffect, useState, useRef } from "react";
import ProfileModal from "../../components/Modal";
import { FaUserEdit } from "react-icons/fa";
import AdminUpdateProfile from "./AdminUpdateProfile";
import { useSelector, useDispatch } from "react-redux";

export default function QueueRegister() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [users, setUsers] = useState();
  const [userToUpdateRetrivedOnClick, setUserToUpdateRetrivedOnClick] =
    useState();
  const modal = useRef();

  const handleClickOpenModal = (user) => {
    modal.current.open();
    console.log(user);
    setUserToUpdateRetrivedOnClick({
      verified: user.fkUserId.verified,
      number: user.fkUserId.number,
      social: user.fkUserId.social,
      avatar: user.fkUserId.avatar,
      createdAt: user.fkUserId.createdAt,
      updatedAt: user.fkUserId.updatedAt,
      email: user.fkUserId.email,
      role: user.fkUserId.fkRoleId.id,
      username: user.fkUserId.username,
      id: user.fkUserId.id,
    });
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

  useEffect(() => {
    const fetchUserToAccept = async () => {
      try {
        const res = await fetch("/queue-user-registration/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${currentUser.access_token}`  
          }
        }
        )
        const acceptableStatusCodes = [200, 201, 202];
        if (acceptableStatusCodes.includes(res.status)) {
          const data = await res.json();
          setUsers(data);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserToAccept();
  }, []);

  const consoleLog = () => {
    console.log(userToUpdateRetrivedOnClick)
    console.log("clicked update");
  };

  return (
    <div className="p-3 max-w-lg mx-auto h-screen">
      <ProfileModal
        ref={modal}
        title="Admin Edit User"
        iconHeader={
          <FaUserEdit className="text-2xl pl-1 hover:scale-105 opacity-80" />
        }
        actions={modalActions("Updates", "bg-orange-400", consoleLog)}
        component={<AdminUpdateProfile user={userToUpdateRetrivedOnClick} />}
      />
      <h1 className="text-3xl font-semibold text-center my-7">
        Check Request Registration
      </h1>
      {users && (
        <div>
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light text-surface">
                    <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          #
                        </th>
                        <th scope="col" className="px-6 py-4">
                          username
                        </th>
                        <th scope="col" className="px-6 py-4">
                          email
                        </th>
                        <th scope="col" className="px-6 py-4">
                          createdAt
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr
                          className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-slate-200"
                          key={user.fkUserId.id}
                          onClick={() => handleClickOpenModal(user)}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {index}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {user.fkUserId.username}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {user.fkUserId.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {user.fkUserId.createdAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
