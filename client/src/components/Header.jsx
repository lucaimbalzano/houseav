import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import home from "../assets/home.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          {isSmallScreen ? (
            <img width={35} height={35} src={home} alt="houseav" />
          ) : (
            <div className="flex items-center gap-6">
              <img width={35} height={35} src={home} alt="houseav" />
              <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                <span className="text-black-500 hover:text-gray-400">
                  HOUSE
                </span>
                <span className="text-gray-400 ">AV</span>
              </h1>
            </div>
          )}
        </Link>
        <form className="bg-slate-100 rounded-lg p-3 flex items-center">
          <input
            type="text"
            placeholder="Search.."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-400 hover:text-slate-200">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-400 hover:text-slate-200">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className=" text-slate-400 hover:text-slate-200">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
