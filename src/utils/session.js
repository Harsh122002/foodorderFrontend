export const clearSession = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem("tokenExpiration");
};

export const checkSessionExpiration = (navigate) => {
  const token = localStorage.getItem("token");

  if (token) {
    const tokenExpiration = new Date(localStorage.getItem("tokenExpiration"));

    if (tokenExpiration && tokenExpiration < new Date()) {
      clearSession();
      window.location.reload();
      return false;
    }

    const remainingTime = tokenExpiration.getTime() - new Date().getTime();

    setTimeout(() => {
      clearSession();
      window.location.reload();
    }, remainingTime);

    return true;
  }

  return false;
};

export const startSession = (token) => {
  localStorage.setItem("token", token);
  const tokenExpiration = new Date();
  tokenExpiration.setHours(tokenExpiration.getHours() + 1);
  localStorage.setItem("tokenExpiration", tokenExpiration.toISOString());

  setTimeout(() => {
    clearSession();
    window.location.reload("/login");
  }, 3600000);
};
