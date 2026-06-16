import { useEffect } from "react";
import EditProfile from "../components/EditProfile";
import ProfileCard from "../components/ProfileCard";
import useGetUserDetails from "../hooks/useGetUserDetails";

const Profile = () => {
  const { userDetails, getDetails } = useGetUserDetails();

  useEffect(() => {
    getDetails();
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-start justify-center">
        {/* Left Section - Form */}
        <EditProfile userDetails={userDetails} getDetails={getDetails} />

        {/* Right Section - Preview Card */}
        <ProfileCard userDetails={userDetails} />
      </div>
    </div>
  );
};

export default Profile;
