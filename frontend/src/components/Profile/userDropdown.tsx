import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

interface Props {
  userName?: string;
  photoUrl?: string;
}

export default function UserDropdown({ userName, photoUrl }: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { handleLogout } = useLogout();

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile section */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <p className="text-white">Welcome, {userName}</p>

        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600">
          <img
            src={
              photoUrl ||
              "https://wallpapers.com/images/high/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg"
            }
            alt="profile"
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg z-50">
          <ul className="py-2 text-sm text-gray-300">
            <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
              <Link to="/profile">Profile</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
              <Link to="/requests">Requests</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
              <Link to="/connections">Connections</Link>
            </li>

            <hr className="border-gray-700 my-2" />

            <li
              className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
