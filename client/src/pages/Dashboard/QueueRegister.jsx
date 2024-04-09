import { useEffect, useState } from "react";

export default function QueueRegister() {
  const [users, setUsers] = useState();
  useEffect(() => {
    const fetchUserToAccept = async () => {
      try {
        const res = await fetch("/api/user/roles/queue-register/");
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

  return (
    <div className="p-3 max-w-lg mx-auto h-screen">
      <h1 className="text-3xl font-semibold text-center my-7">
        Check Request Registration
      </h1>
      {users && (
        <div>
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
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
                          className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-300 dark:border-white/10 dark:hover:bg-neutral-600"
                          key={user._id}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {index}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {user.username}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {user.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {user.createdAt}
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
