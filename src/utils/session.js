// utils/session.js

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("tokenExpiration");
  sessionStorage.removeItem("token");
};

export const checkSessionExpiration = (navigate) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    const tokenExpiration = new Date(localStorage.getItem("tokenExpiration"));

    // Check if the token has already expired
    if (tokenExpiration && tokenExpiration < new Date()) {
      // Session has expired
      clearSession();
      alert("Session expired. Please login again.");
      navigate("/login");
      return false;
    }

    // Calculate remaining time until expiration
    const remainingTime = tokenExpiration - new Date();

    // Set a timeout to clear session and alert user when session expires
    setTimeout(() => {
      clearSession();
      alert("Session expired. Please login again.");
      navigate("/login");
    }, remainingTime);

    return true; // Session is valid
  }

  return false; // No session token found
};
