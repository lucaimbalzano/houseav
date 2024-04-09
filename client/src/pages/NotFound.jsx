import { Link } from "react-router-dom";
import notfound from "../assets/notfound.svg";
import home from "../assets/home.png";
import { TiArrowBack } from "react-icons/ti";
export default function NotFound() {
  return (
    <div className="h-screen w-auto flex-col md:flex justify-center items-center mb-10">
      <Link to="/">
        <div className="flex justify-center items-center pt-32 mb-10">
          <img width={35} height={35} src={home} alt="houseav" />
        </div>
      </Link>
      <p className="text-xl md:text-3xl text-gray-500 text-center">
        Sorry we didn't find this page!
      </p>
      <Link to="/">
        <div className="w-full text-center mt-4 justify-center text-gray-900 py-3 px-6 border border-gray-400 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3">
          Go home
          <TiArrowBack />
        </div>
      </Link>
      <img src={notfound} className="w-auto h-auto md:w-[800px] md:[950px]" />
    </div>
  );
}
