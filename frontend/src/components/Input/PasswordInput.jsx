import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'; // Corrected import from 'fa6' to 'fa'

const PasswordInput = ({ value, onChange, placeholder }) => {
  // State to manage the visibility of the password
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded-md">

      <input
        value={value}
        onChange={onChange}

        type={isShowPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Password'}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded-none outline-none"
      />

     
      {isShowPassword ? (
        <FaRegEyeSlash // Changed to FaRegEyeSlash when password is shown
          size={22}
          className="text-primary cursor-pointer"
          onClick={toggleShowPassword} // Corrected onClick to pass function reference
        />
      ) : (
        <FaRegEye // Changed to FaRegEye when password is hidden
          size={22}
          className="text-primary cursor-pointer" // Reverted class name to text-primary
          onClick={toggleShowPassword} // Corrected onClick to pass function reference
        />
      )}
    </div>
  );
};

export default PasswordInput;