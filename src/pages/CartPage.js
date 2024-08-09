import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { checkSessionExpiration } from "../utils/session";

export const CartPage = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate total order amount
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const handleOrder = () => {
    const session = checkSessionExpiration(navigate);
    if (session) {
      navigate("/orderPlace");
    } else {
      alert("Session expired");
      navigate("/login");
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <h2 className="text-2xl font-bold mb-4 mt-32">Collection of Item</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cart.map((item, index) => (
              <div key={index} className="p-4 border rounded shadow-lg">
                <img
                  src={
                    item.image
                      ? `${process.env.REACT_APP_API_BASE_URL_IMAGE}/${item.image}`
                      : "/back.png"
                  }
                  alt={item.name}
                  className="w-full h-32 object-cover mb-4"
                />
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="mt-2 text-xs">Quantity: {item.qty}</p>
                <p className="mt-2 text-xs">Price: Rs.{item.price}</p>
                <p className="mt-2 text-xs">
                  Total: Rs.{item.qty * item.price}
                </p>
                <button
                  onClick={() => removeFromCart(item.name)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-xl font-bold">
              Total Order Amount: Rs.{totalAmount.toFixed(2)}
            </h3>
            <button
              onClick={handleOrder}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Order Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};
