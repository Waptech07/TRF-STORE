"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineX, HiTrash, HiShoppingCart } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

const Cart = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
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

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleWhatsApp = () => {
    const totalPrice = calculateTotalPrice();
    const message =
      "I would like to purchase the following items:\n" +
      cartItems
        .map(
          (item) =>
            `${item.name} - ₦${item.price.toFixed(2)} - Size: ${
              item.size
            } - Quantity: ${item.quantity}`
        )
        .join("\n") +
      `\n\nTotal Price: ₦${totalPrice.toFixed(2)}`;

    const whatsappUrl = `https://wa.me/+2348101865915?text=${encodeURIComponent(
      message
    )}`;

    const confirmOrder = window.confirm(
      "Are you sure you want to place this order? You will be redirected to WhatsApp."
    );

    if (confirmOrder) {
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleClearCart = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all items from your cart?"
    );
    if (confirmClear) {
      localStorage.removeItem("cart");
      setCartItems([]);
    }
  };

  return (
    <div className="fixed right-0 top-16 w-80 h-96 bg-white shadow-lg p-4 border border-gray-300 z-50 rounded-lg flex flex-col justify-between overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
        <HiOutlineX
          className="cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={onClose}
        />
      </div>
      <div className="mt-2 flex-grow overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 bg-gray-100 p-4 rounded-md">
            <HiShoppingCart className="text-3xl mx-auto mb-2" />
            Your cart is empty.
          </p>
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
                <div className="flex items-center">
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
                  <p className="text-gray-600 ml-4 font-semibold">
                    ₦{(item.price * item.quantity).toFixed(2)}
                  </p>
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
      {cartItems.length > 0 && (
        <div className="flex flex-col border-t border-gray-200 pt-4 mt-4">
          <p className="text-lg font-bold text-gray-700 mb-2">
            Total: ₦{calculateTotalPrice().toFixed(2)}
          </p>
          <div className="flex gap-3">
            <button
              className="flex-1 bg-green-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition"
              onClick={handleWhatsApp}
            >
              <FaWhatsapp /> Order Now
            </button>
            <button
              className="flex-1 bg-red-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition"
              onClick={handleClearCart}
            >
              <HiTrash /> Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
