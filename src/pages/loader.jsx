import React from "react";

export default function Loader() {
  const text = "HR FOOD.....".split("");

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="flex space-x-1 mt-4">
        {text.map((char, index) => (
          <span
            key={index}
            className={`text-3xl font-bold text-[#343a40] inline-block animate-bounce`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '1.2s',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );

}

