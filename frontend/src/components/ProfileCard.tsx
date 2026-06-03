import React from "react";

const ProfileCard = () => {
  return (
    <div className="w-full lg:w-[350px]">
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
        <div className="h-80 bg-red-500 flex items-center justify-center">
          <div className="text-8xl text-white">☺</div>
        </div>

        <div className="p-5">
          <h2 className="text-2xl font-bold">Chandler Bing</h2>

          <p className="text-gray-400 mb-3">25, Female</p>

          <p className="text-gray-300 mb-5">
            This is the default about section.
          </p>

          {/* <div className="flex gap-3">
            <button className="flex-1 bg-pink-500 hover:bg-pink-600 py-3 rounded-lg font-semibold">
              Ignore
            </button>

            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold">
              Interested
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
