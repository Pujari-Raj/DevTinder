import React from "react";

const EditProfile = () => {
  return (
    <div className="w-full max-w-2xl bg-slate-900 rounded-xl p-8 shadow-lg">
      <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
      <p className="text-gray-400 mb-8">
        Update your DevTinder profile information
      </p>

      {/* Name */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Name</label>
        <input
          type="text"
          placeholder="Enter name"
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 cursor-not-allowed"
          disabled
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          disabled
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 opacity-70 cursor-not-allowed"
        />
      </div>

      {/* Photo URL */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="w-20 h-20 rounded-full border-2 border-indigo-500 overflow-hidden flex-shrink-0">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <label className="block text-gray-300 mb-2">Profile Photo URL</label>
          <input
            type="text"
            placeholder="Enter image URL"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-indigo-500"
          />
          <p className="text-sm text-gray-500 mt-2">
            Provide a URL to your profile picture
          </p>
        </div>
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-3">Gender</label>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="gender" />
            Male
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="gender" />
            Female
          </label>
        </div>
      </div>

      {/* Age */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Age</label>
        <input
          type="number"
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-indigo-500"
        />
      </div>

      {/* Skills */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">
          Skills (Enter up to 5 skills, separated by commas)
        </label>
        <input
          type="text"
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-indigo-500"
        />
      </div>

      {/* About */}
      <div className="mb-8">
        <label className="block text-gray-300 mb-2">About Me</label>
        <textarea
          rows={5}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 resize-none outline-none focus:border-indigo-500"
        />
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <button className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-lg font-semibold">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
