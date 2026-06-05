import React from "react";
import EditProfile from "../components/EditProfile";
import ProfileCard from "../components/ProfileCard";

const Profile = () => {
  return (
    <div className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-start justify-center">
        {/* Left Section - Form */}
        <EditProfile />

        {/* Right Section - Preview Card */}
        <ProfileCard />
      </div>
    </div>
  );
};

export default Profile;
