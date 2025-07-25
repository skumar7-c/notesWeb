import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo , onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg font-bold">
        {getInitials(userInfo.fullName)}
      </div>

      <div>
        <p className="text-sm bold text-blue-500 underline font-medium">{userInfo.fullName}</p>
        <button className="text-sm bold text-blue-500 underline"onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;