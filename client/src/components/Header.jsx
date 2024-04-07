import { RxDashboard } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import home from "../assets/home.png";
import { checkIfIsAdmin } from "../../utils/utils";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (currentUser || !isAdmin) checkIfIsAdmin(currentUser, setIsAdmin);
    console.log(isAdmin);
  }, [currentUser]);

  return (
    <header className="bg-white">
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

        <ul className="flex gap-4 items-center">
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
          {isAdmin && (
            <Link to="/profile">
              <RxDashboard className="text-2xl text-center flex items-center" />
            </Link>
          )}
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
