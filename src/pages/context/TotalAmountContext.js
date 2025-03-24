import React, { createContext, useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContext";

export const TotalAmountContext = createContext();

export const TotalAmountProvider = ({ children }) => {
  const { cart } = useContext(CartContext);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Calculate the total amount using reduce
    const total = cart?.reduce((acc, item) => acc + (item.qty * item.price), 0) || 0;
    console.log("Total", total);
    
    setTotalAmount(total);
  }, [cart]);

  return (
    <TotalAmountContext.Provider value={{ totalAmount, setTotalAmount }}>
      {children}
    </TotalAmountContext.Provider>
  );
};
