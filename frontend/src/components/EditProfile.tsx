import { useEffect, useState } from "react";
import type { User } from "../@types/types";
import useEditProfile from "../hooks/useEditProfile";

interface EditProfileProps {
  userDetails: User | null;
  getDetails: () => Promise<void>;
}

const EditProfile = ({ userDetails, getDetails }: EditProfileProps) => {
  const { handleEditProfile, isLoading } = useEditProfile();

  const [formData, setFormData] = useState({
    age: "",
    photoUrl: "",
    about: "",
    skills: "",
  });

  useEffect(() => {
    if (userDetails) {
      setFormData({
        age: String(userDetails.age ?? ""),
        photoUrl: userDetails.photoUrl ?? "",
        about: userDetails.about ?? "",
        skills: userDetails.skills?.join(", ") ?? "",
      });
    }
  }, [userDetails]);

  const hasChanges =
    userDetails &&
    (formData.age !== String(userDetails.age ?? "") ||
      formData.photoUrl !== (userDetails.photoUrl ?? "") ||
      formData.about !== (userDetails.about ?? "") ||
      formData.skills !== (userDetails.skills?.join(", ") ?? ""));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSave = async () => {
    if (!userDetails) return;

    const payload: Record<string, any> = {};

    if (formData.age !== String(userDetails.age ?? "")) {
      payload.age = Number(formData.age);
    }

    if (formData.photoUrl !== (userDetails.photoUrl ?? "")) {
      payload.photoUrl = formData.photoUrl;
    }

    if (formData.about !== (userDetails.about ?? "")) {
      payload.about = formData.about;
    }

    if (formData.skills !== (userDetails.skills?.join(", ") ?? "")) {
      payload.skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }
    
    const success = await handleEditProfile(payload);

    if (success) {
      await getDetails();
    }
  };

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
          value={userDetails?.name || ""}
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
          value={userDetails?.email || ""}
        />
      </div>

      {/* Photo URL */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="w-20 h-20 rounded-full border-2 border-indigo-500 overflow-hidden flex-shrink-0">
          <img
            src={formData?.photoUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <label className="block text-gray-300 mb-2">Profile Photo URL</label>
          <input
            type="text"
            name="photoUrl"
            value={formData?.photoUrl}
            onChange={handleChange}
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
            <input
              type="radio"
              name="gender"
              value="male"
              checked={userDetails?.gender === "male"}
              readOnly
              className="radio border-gray-600 checked:bg-sky-500 checked:border-sky-500"
              disabled
            />
            Male
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={userDetails?.gender === "female"}
              readOnly
              className="radio border-gray-600 checked:bg-sky-500 checked:border-sky-500"
              disabled
            />
            Female
          </label>
        </div>
      </div>

      {/* Age */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
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
          name="skills"
          value={formData.skills}
          onChange={handleChange}
        />
      </div>

      {/* About */}
      <div className="mb-8">
        <label className="block text-gray-300 mb-2">About Me</label>
        <textarea
          rows={5}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 resize-none outline-none focus:border-indigo-500"
          name="about"
          value={formData.about}
          onChange={handleChange}
        />
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={isLoading || !hasChanges}
          className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
