import axios from "axios";

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
const API_KEY ="c5d68ece4f7a43afa44dfc7fb3d57e7f"

// Replace with your actual OpenCage API key

/**
 * Get coordinates (latitude & longitude) from an address using OpenCage API.
 *
 * @param {string} address - The address you want to geocode.
 * @returns {Promise<{ latitude: number, longitude: number } | { error: string }>}
 */
export async function getCoordinatesFromAddress(address) {
  try {
    // Validate address input
    if (!address || typeof address !== "string") {
      return { error: "Invalid address provided" };
    }

    // Construct the API URL
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${API_KEY}`;

    // Make the API request
    const response = await axios.get(url);

    // Extract data
    const results = response.data.results;

    if (results && results.length > 0) {
      const { lat, lng } = results[0].geometry;
      return {
        latitude: lat,
        longitude: lng,
      };
    } else {
      return { error: "No coordinates found for this address" };
    }

  } catch (err) {
    console.error("Geocoding error:", err.message);
    return { error: "Error fetching coordinates" };
  }
}
