import React, { useContext } from "react";
import { CartContext } from "./context/CartContext";
import { useNavigate } from "react-router-dom";
import { checkSessionExpiration } from "../utils/session";

export const CartPage = () => {
  const { cart, removeFromCart, updateCartItemQuantity } =
    useContext(CartContext);
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
    <div className="container min-h-[100vh] py-36 mx-auto p-4 px-12 bg-[#c4b4a5] text-white">
      <h1 className="flex justify-center  mb-10 text-3xl font-bold text-[#343a40]">Orders Cart</h1>
      {cart.length === 0 ? (
        <p className="flex justify-center items-center text-lg ">Your cart is empty</p>
      ) : (
        <>
          <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cart.map((item, index) => (
              <div key={index} className="p-4 w-64 bg-[#a19182] rounded-md shadow-lg">
                <img
                  src={
                    item.image
                      ? `${process.env.REACT_APP_API_BASE_URL_IMAGE}/${item.image}`
                      : "/back.png"
                  }
                  alt={item.name}
                  className="w-full h-40 rounded-md object-cover mb-4"
                />
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="mt-2 text-xs">Price: Rs.{item.price}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      updateCartItemQuantity(
                        item.name,
                        Math.max(item.qty - 1, 1)
                      )
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                    -
                  </button>
                  <span className="mx-2">{item.qty}</span>
                  <button
                    onClick={() =>
                      updateCartItemQuantity(
                        item.name,
                        Math.min(item.qty + 1, 4)
                      )
                    }
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                    +
                  </button>
                </div>
                <p className="mt-2 text-xs">
                  Total: Rs.{item.qty * item.price}
                </p>
                <button
                  onClick={() => removeFromCart(item.name)}
                  className="bg-red-500 border-2 mt-1 border-red-500 text-white text-[10px] lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded hover:text-red-500 hover:bg-white duration-500 ease-in-out"
                  >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-xl font-bold text-[#343a40]">
              Total Order Amount: Rs.{totalAmount.toFixed(2)}
            </h3>
            <button
              onClick={handleOrder}
              className="bg-green-700 border-2 border-green-700 text-white text-[10px] lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded hover:text-green-700 hover:bg-white duration-500 ease-in-out"
            >
              Order Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};
