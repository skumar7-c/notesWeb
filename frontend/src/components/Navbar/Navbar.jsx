import React, { useState } from 'react';
import ProfileInfo from "../cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import Searchbar from "../Searchbar/Searchbar";

const Navbar = ({ userInfo, onSearchNote , handleClearSearch}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/Login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  }; 

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };


  
  return (
    
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      {userInfo &&
        <>
          <Searchbar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
            
         />
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      }
      
    </div>
    
  );
};

export default Navbar;