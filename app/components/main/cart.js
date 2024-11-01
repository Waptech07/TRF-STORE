"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineX, HiTrash } from "react-icons/hi";

const Cart = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items from local storage when the component mounts
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateCartInLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const handleIncreaseQuantity = (id, size) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.size === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCartInLocalStorage(updatedCart);
  };

  const handleDecreaseQuantity = (id, size) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id && item.size === size && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    updateCartInLocalStorage(updatedCart);
  };

  const handleDeleteItem = (id, size) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.size === size)
    );
    updateCartInLocalStorage(updatedCart);
  };

  const handleWhatsApp = () => {
    const message =
      "I would like to purchase the following items:\n" +
      cartItems
        .map(
          (item) =>
            `${item.name} - ₦${item.price.toFixed(2)} - Size: ${
              item.size
            } - Quantity: ${item.quantity}`
        )
        .join("\n");
    const whatsappUrl = `https://wa.me/+2348101865915?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed right-0 top-16 w-80 h-96 bg-white shadow-lg p-4 border border-gray-300 z-50 rounded-lg overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
        <HiOutlineX
          className="cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={onClose}
        />
      </div>
      <div className="mt-2">
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex justify-between items-center py-2 border-b border-gray-200"
            >
              <div className="flex flex-col">
                <strong className="text-gray-700">{item.name}</strong>
                <p className="text-gray-600">₦{item.price.toFixed(2)}</p>
                <p className="text-gray-600">Size: {item.size}</p>
                <div className="flex items-center mt-1">
                  <button
                    className="bg-gray-200 text-gray-700 rounded-l px-2 py-1 hover:bg-gray-300"
                    onClick={() => handleDecreaseQuantity(item.id, item.size)}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="bg-gray-200 text-gray-700 rounded-r px-2 py-1 hover:bg-gray-300"
                    onClick={() => handleIncreaseQuantity(item.id, item.size)}
                  >
                    +
                  </button>
                </div>
              </div>
              <HiTrash
                className="text-red-500 cursor-pointer hover:text-red-700 ml-4"
                onClick={() => handleDeleteItem(item.id, item.size)}
              />
            </div>
          ))
        )}
      </div>
      <button
        className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        onClick={handleWhatsApp}
      >
        Order Now
      </button>
    </div>
  );
};

export default Cart;
