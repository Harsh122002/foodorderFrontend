// Function to clear session
export const clearSession = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem("tokenExpiration");
};

// Function to check session expiration
export const checkSessionExpiration = (navigate) => {
  const token = localStorage.getItem("token");

  if (token) {
    const tokenExpiration = new Date(localStorage.getItem("tokenExpiration"));

    if (tokenExpiration && tokenExpiration < new Date()) {
      // Session has expired
      clearSession();
      alert("Session expired. Please login again.");
      navigate("/login");
      window.location.reload(); // Reload the page
      return false;
    }

    // Calculate remaining time until expiration
    const remainingTime = tokenExpiration.getTime() - new Date().getTime();

    // Set a timeout to clear session and alert user when session expires
    setTimeout(() => {
      clearSession();
      alert("Session expired. Please login again.");
      window.location.reload();
      navigate("/login");
    }, remainingTime);

    return true; // Session is valid
  }

  return false; // No session token found
};

// Function to start the session with a 1-hour expiration
export const startSession = (token) => {
  localStorage.setItem("token", token);
  const tokenExpiration = new Date();
  tokenExpiration.setHours(tokenExpiration.getHours() + 1);
  localStorage.setItem("tokenExpiration", tokenExpiration.toISOString());

  // Set timeout for 1 hour to automatically log out the user
  setTimeout(() => {
    clearSession();
    alert("Session expired. Please login again.");
    window.location.reload("/login");
  }, 3600000); // 1 hour in milliseconds
};

// Call this function when the user logs in to start the session
