import React, { createContext, useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContext";

export const TotalAmountContext = createContext();

export const TotalAmountProvider = ({ children }) => {
  const { cart } = useContext(CartContext);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
      setTotalAmount(total);
    };

    calculateTotalAmount();
  }, [cart]);

  return (
    <TotalAmountContext.Provider value={totalAmount}>
      {children}
    </TotalAmountContext.Provider>
  );
};
