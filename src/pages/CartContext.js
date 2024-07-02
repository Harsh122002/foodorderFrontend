import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.name === product.name
      );

      if (existingProductIndex !== -1) {
        // Product with the same ID exists in cart, update its quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].qty += product.qty;
        return updatedCart;
      } else {
        // Product with the same ID does not exist in cart, add it
        return [...prevCart, product];
      }
    });
  };

  const removeFromCart = (productName) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== productName));
  };
  const removeFromCart1 = () => {
    setCart([]); // Clear the cart by setting it to an empty array
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, removeFromCart1 }}
    >
      {children}
    </CartContext.Provider>
  );
};
