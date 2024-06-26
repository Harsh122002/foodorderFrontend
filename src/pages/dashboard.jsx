import React from "react";

export const Dashboard = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 mx-auto"
        >
          <div className="w-60 h-60 rounded overflow-hidden shadow-lg mx-auto">
            <img className="w-full h-32" src="/back.png" alt="" />
          </div>
        </div>
      ))}
    </div>
  );
};
