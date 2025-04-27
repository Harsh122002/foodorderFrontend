import React, { useEffect, useState } from "react";

function Alert({ message }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => prev - 2);
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed top-32 right-10  bg-green-100 text-green-800 shadow-lg rounded-md p-4 w-80 z-50">
      <div className="text-center font-semibold">{message}</div>
      <div className="mt-2 h-2 w-full bg-green-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-600 transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default Alert;
