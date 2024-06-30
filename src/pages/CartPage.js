import React, { useContext } from "react";
import { CartContext } from "./CartContext";

export const CartPage = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  console.log(cart.id);
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cart.map((item, index) => (
            <div key={index} className="p-4 border rounded shadow-lg">
              <img
                src={item.image || "/back.png"}
                alt={item.name}
                className="w-full h-32 object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="mt-2">Quantity: {item.qty}</p>
              <button
                onClick={() => removeFromCart(item.name)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
