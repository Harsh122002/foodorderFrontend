import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 20) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

    useEffect(() => {
      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 p-4 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-600 transition-all"
          title="Go to top"
        >
          <FaArrowUp class="animate-bounce" />
        </button>
      )}
    </div>
  );
}

export default ScrollToTopButton;
