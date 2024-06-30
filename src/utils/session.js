// utils/session.js

export const checkSessionExpiration = () => {
  const token = sessionStorage.getItem("token");
  setTimeout(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    alert("Session expired. Please login again.");
  }, 1000);
  if (token) {
    const tokenExpiration = new Date(localStorage.getItem("tokenExpiration"));
    if (tokenExpiration && tokenExpiration < new Date()) {
      // Session has expired
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      sessionStorage.removeItem("token");
      alert("Session expired. Please login again.");
      return false;
    }
    return true; // Session is valid
  }
  return false; // No session token found
};
