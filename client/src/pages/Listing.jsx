import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaWifi,
} from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { BsFillPeopleFill, BsFillCalendarDateFill } from "react-icons/bs";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  function getFormattedDate(date) {
    var newDate = new Date(date);
    return newDate.toISOString().split("T")[0];
  }

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/house/${params.id}`);
        const acceptableStatusCodes = [200, 201, 202];
        if (!acceptableStatusCodes.includes(res.status)) {
          setError(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setListing({
          ...data,
          availabilityDateStart: getFormattedDate(data.availabilityDateStart),
          availabilityDateEnd: getFormattedDate(data.availabilityDateEnd),
          imageUrls: data.imageUrls.split(";")
        });

        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);
  

  
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <div className="flex text-2xl font-semibold">
              {listing.title} -
              {listing.availability ? (
                <span className={listing.availability ? "ml-2 flex" : "flex"}>
                  <span
                    className={
                      listing.availability ? "text-gray-500" : "text-red-600"
                    }
                  >
                    {listing.availability ? "Av" : "Un"}
                  </span>
                  <span>{listing.availability ? "ailable" : "vailable"}</span>
                </span>
              ) : null}
            </div>
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              <IoCopy className="text-slate-500 hover:text-gray-400" />
              <p className="hover:text-gray-600 text-gray-800 text-xs">
                Copy URL
              </p>
            </div>
            <p className="flex items-center mt-1 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-blue-400" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              {listing.availabilityDateStart && (
                <div className="bg-blue-400 w-full max-w-[200px] text-white text-center p-2 rounded-md flex gap-6 items-center">
                  <BsFillCalendarDateFill className="" />
                  <div>
                    <span className="">
                      <p className="text-[10px] text-gray-300">from</p>
                      {listing.availabilityDateStart}
                    </span>
                  </div>
                </div>
              )}
              {listing.availabilityDateEnd && (
                <div className="bg-blue-500 w-full max-w-[200px] text-white text-center p-3 rounded-md flex gap-6 items-center">
                  <BsFillCalendarDateFill className="" />
                  <div>
                    <span className="">
                      <p className="text-[10px] text-gray-300">to</p>
                      {listing.availabilityDateEnd}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-gray-600 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <BsFillPeopleFill className="text-lg" />
                {listing.sleepPlace > 1
                  ? `${listing.sleepPlace} Total sleep place `
                  : `${listing.sleepPlace} Total sleep places `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaWifi className="text-lg" />
                {listing.wifi ? "Wifi" : "No wifi"}
              </li>
            </ul>
            {currentUser &&
              listing &&
              listing.fkIdUser &&
              listing.fkIdUser.id !== currentUser.id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact landlord
                </button>
              )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
