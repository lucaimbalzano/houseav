import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-slate-700">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">LOGO</span>
            <span className="text-slate-100">TOGO</span>
          </h1>
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
          <Link to="/sign-in">
            <li className=" text-slate-400 hover:text-slate-200">Sign in</li>
          </Link>
        </ul>
      </div>
    </header>
  );
}