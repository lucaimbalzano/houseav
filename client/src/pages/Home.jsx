import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import SearchFilter from "../components/SearchFilter/SearchFilter";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      <div className="flex flex-col lg:flex-row h-screen justify-center items-center lg:justify-between">
        <div className="flex-1 flex flex-col gap-6 p-10 md:p-28 px-3 max-w-6xl mx-auto max-w-[90%]">
          <h1 className="text-black-700 font-bold pt-24 sm:pt-0 text-4xl lg:text-7xl">
            Be <span className="text-slate-500">hospitable</span> to one another
            <br />
            without complaint.
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            You can share your house or find a lovely person who is sharing.
            <br />1 Peter 4:9
          </div>
          <SearchFilter />
        </div>

        <div className="flex-1 flex justify-center pr-2 md:pr-32">
          <img
            src="./roomHomePage2.png"
            alt=""
            className="h-[290px] w-[290px] mb-24 sm:h-[350px] sm:w-[390px] items-center"
          />
        </div>
      </div>

      {/* swiper */}
      {/* <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper> */}

      {/* listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
