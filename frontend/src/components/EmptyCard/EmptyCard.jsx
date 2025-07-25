import React from "react";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img src={imgSrc} alt="No notes" className="w-60" />
      <p className="w-3/4 md:w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
