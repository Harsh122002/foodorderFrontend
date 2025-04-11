import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from './context/UserContext';

export default function MapView() {
  const location = useLocation();
  const { userDetail } = useContext(UserContext);
console.log(location.state?.coordinates?.latitude );

  const [customerCoords, setCustomerCoords] = useState(null);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    if (location.state?.coordinates) {
      setCustomerCoords({
        lat: location.state.coordinates.latitude,
        lng: location.state.coordinates.longitude,
      });
    }

    if (userDetail?.location) {
      setUserCoords({
        lat: userDetail.location.latitude,
        lng: userDetail.location.longitude,
      });
    }
  }, [location.state?.coordinates, userDetail]);

  // const isWithinJunagadh = ({ lat, lng }) => {
  //   return lat >= 21.48 && lat <= 21.55 && lng >= 70.30 && lng <= 70.5;
  // };
  
  const openGoogleMaps = () => {
    if (userCoords && customerCoords) {
      // const bothInJunagadh =
      //   isWithinJunagadh(userCoords) && isWithinJunagadh(customerCoords);
  
      // if (!bothInJunagadh) {
      //   alert('One or both coordinates are not in Junagadh, Gujarat.');
      //   return;
      // }
  
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${customerCoords.lat},${customerCoords.lng}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      alert('Coordinates not available yet!');
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Map View</h2>

      <div className="mt-4">
        <h3 className="font-semibold">Customer Coordinates:</h3>
        <p>Latitude: {customerCoords?.lat}</p>
        <p>Longitude: {customerCoords?.lng}</p>

        <h3 className="font-semibold mt-2">User Coordinates:</h3>
        <p>Latitude: {userCoords?.lat}</p>
        <p>Longitude: {userCoords?.lng}</p>
      </div>

      <button
        onClick={openGoogleMaps}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Open in Google Maps
      </button>
    </div>
  );
}
