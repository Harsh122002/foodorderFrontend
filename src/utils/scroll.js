import React, { useState, useEffect } from "react";
import { FaArrowUp, FaLongArrowAltUp } from "react-icons/fa";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when the user scrolls down 20px from the top
  const toggleVisibility = () => {
    if (window.pageYOffset > 20) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Listen to scroll events
    window.addEventListener("scroll", toggleVisibility);

    // Cleanup the event listener on component unmount
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
