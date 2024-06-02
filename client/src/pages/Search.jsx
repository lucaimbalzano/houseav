import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import ProfileInReview from "../pages/Profile/ProfileInReview";

export default function Search() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    parking: false,
    furnished: false,
    wifi: true,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const wifiFromUrl = urlParams.get("wifi");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      wifiFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        wifi: wifiFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/house/get?${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.access_token}`
        }
      });
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "wifi"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("wifi", sidebardata.wifi);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    // navigate(`/search?${searchQuery}`);
    //GET HOUSES WITH NEW PARAMETERES AND FILL OUR USESTATE
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/house/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      {currentUser.user.fkRoleId ? (
        <>
          <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap font-semibold">
                  Search Term:
                </label>
                <input
                  type="text"
                  id="searchTerm"
                  placeholder="Search..."
                  className="border rounded-lg p-3 w-full"
                  value={sidebardata.searchTerm}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <label className="font-semibold">Type:</label>

                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="wifi"
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.wifi}
                  />
                  <span>Wifi</span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <label className="font-semibold">Amenities:</label>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.parking}
                  />
                  <span>Parking</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.furnished}
                  />
                  <span>Furnished</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold">Sort:</label>
                <select
                  onChange={handleChange}
                  defaultValue={"created_at_desc"}
                  id="sort_order"
                  className="border rounded-lg p-3"
                >
                  <option value="regularPrice_desc">Price high to low</option>
                  <option value="regularPrice_asc">Price low to hight</option>
                  <option value="createdAt_desc">Latest</option>
                  <option value="createdAt_asc">Oldest</option>
                </select>
              </div>
              <button className="w-full text-center mt-4 justify-center text-gray-900 font-semibold py-3 px-6 bg-gray-400 bg-opacity-50 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3 justify-between">
                Search
                <FaSearch />
              </button>
            </form>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
              Listing results:
            </h1>
            <div className="p-7 flex flex-wrap gap-4">
              {!loading && listings.length === 0 && (
                <p className="text-xl text-slate-700">No listing found!</p>
              )}
              {loading && (
                <p className="text-xl text-slate-700 text-center w-full">
                  Loading...
                </p>
              )}

              {!loading &&
                listings &&
                listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}

              {showMore && (
                <button
                  onClick={onShowMoreClick}
                  className="text-green-700 hover:underline p-7 text-center w-full"
                >
                  Show more
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="p-3 max-w-lg mx-auto h-screen pt-20">
          <p className="text-2xl text-center text-red-600">Not authorized</p>
          <ProfileInReview />
        </div>
      )}
    </div>
  );
}
