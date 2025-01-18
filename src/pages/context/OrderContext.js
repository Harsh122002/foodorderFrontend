import React, { createContext, useState, useContext } from "react";

// Create OrderContext
const OrderContext = createContext();

// Custom hook to use OrderContext
export const useOrder = () => useContext(OrderContext);

// OrderContext Provider component
export const OrderProvider = ({ children }) => {
  const [orderId, setOrderId] = useState(null);

  return (
    <OrderContext.Provider value={{ orderId, setOrderId }}>
      {children}
    </OrderContext.Provider>
  );
};
