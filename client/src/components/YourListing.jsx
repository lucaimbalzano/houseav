import { Link } from "react-router-dom";
import { RiDeleteBin6Fill, RiEditCircleFill } from "react-icons/ri";
import { BsHousesFill } from "react-icons/bs";

export default function YourListing({
  userListings,
  setUserListings,
  currentUser
}) {
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/house/${listingId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${currentUser.access_token}`
          }
      });
      const acceptableStatusCodes = [200, 201, 202];
      if (!acceptableStatusCodes.includes(res.status)) {
        console.log(res);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing.id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      {currentUser.user.fkRoleId &&
        userListings != undefined &&
        userListings.length == 0 && (
          <p className="text-sm text-blue-300 flex justify-center">
            Listings not present for this user
          </p>
        )}
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4 relative">
          <h1 className="justify-center items-center mt-7 text-2xl font-semibold flex gap-2">
            <BsHousesFill /> Your Listings
          </h1>
          <div className="bg-white w-auto shadow-md rounded-xl p-3">
            {userListings.map((listing) => (
              <div
                key={listing.id}
                className="rounded-lg p-3 flex justify-between items-center gap-4 hover:bg-slate-100"
              >
                <Link to={`/listing/${listing.id}`}>
                  <img
                    src={listing.imageUrls.split(";")[0]}
                    alt="listing cover"
                    className="rounded-full hover:scale-105 h-20 w-20 object-cover cursor-pointer self-center mt-2"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                  to={`/listing/${listing.id}`}
                >
                  <p className="whitespace-normal">{listing.title}</p>
                </Link>

                <div className="flex flex-col item-center">
                  <button
                    onClick={() => handleListingDelete(listing.id)}
                    className="text-red-700 hover:scale-105 opacity-65 flex items-center gap-2"
                  >
                    <RiDeleteBin6Fill />
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing.id}`}>
                    <button className="text-green-700 hover:scale-105 opacity-65 flex items-center gap-2">
                      <RiEditCircleFill />
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
