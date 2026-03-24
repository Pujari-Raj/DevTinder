import { Link } from "react-router-dom";
import { FaCode } from "react-icons/fa";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800 shadow-lg">
      <nav className="navbar px-4 lg:px-8">
        <div className="flex-1">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-bold text-white hover:text-sky-400 transition"
          >
            <FaCode className="text-sky-500" />
            DevTinder
          </Link>
        </div>
        
        <div className="flex-none gap-4">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white hover:bg-gray-900 transition rounded-lg"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white hover:bg-gray-900 transition rounded-lg"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
