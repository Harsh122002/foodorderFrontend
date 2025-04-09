import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userDetail } = useContext(UserContext);
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when userDetail is available
  useEffect(() => {
    if (userDetail?.name) {
      const storedCart = localStorage.getItem(`cart_${userDetail.name}`);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, [userDetail]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (userDetail?.name) {
      localStorage.setItem(`cart_${userDetail.name}`, JSON.stringify(cart));
    }
  }, [cart, userDetail]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.name === product.name
      );

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].qty += product.qty;
        return updatedCart;
      } else {
        return [...prevCart, product];
      }
    });
  };

  const removeFromCart = (productName) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.name !== productName)
    );
  };

  const removeFromCart1 = () => {
    setCart([]);
  };

  const updateCartItemQuantity = (itemName, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === itemName ? { ...item, qty: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        removeFromCart1,
        updateCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
