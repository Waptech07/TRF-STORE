"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineX, HiTrash } from "react-icons/hi";
import { FaHeartBroken, FaShoppingCart } from "react-icons/fa";
import { HiMiniTrash } from "react-icons/hi2";

const Wishlist = ({ onClose }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(storedWishlist);
  }, []);

  const handleDeleteItem = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    updateWishlistInLocalStorage(updatedWishlist);
  };

  const handleMoveToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingCartItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.size === item.size
    );

    if (existingCartItem) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id && cartItem.size === item.size
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      localStorage.setItem(
        "cart",
        JSON.stringify([...cart, { ...item, quantity: 1 }])
      );
    }

    handleDeleteItem(item.id);
    alert("Item moved to cart successfully!");
    alert("Item removed from wishlist.");
  };

  const updateWishlistInLocalStorage = (updatedWishlist) => {
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleClearWishlist = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all items from your wishlist?"
    );
    if (confirmClear) {
      localStorage.removeItem("wishlist");
      setWishlistItems([]);
      alert("Wishlist cleared successfully!");
    }
  };

  return (
    <div className="fixed right-0 top-16 w-80 h-96 bg-white shadow-xl p-4 border border-gray-300 z-50 rounded-lg flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Your Wishlist</h2>
        <HiOutlineX
          className="cursor-pointer text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
        />
      </div>

      <div className="flex-grow overflow-y-auto space-y-4">
        {wishlistItems.length === 0 ? (
          <p className="text-center text-gray-600 bg-gray-100 p-5 rounded-md">
            <FaHeartBroken className="text-3xl mx-auto mb-2"/>
            Your wishlist is empty.
          </p>
        ) : (
          wishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm"
            >
              <div>
                <h3 className="text-gray-700 font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  ₦{item.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
              </div>
              <div className="flex gap-3">
                <FaShoppingCart
                  className="text-xl text-blue-500 cursor-pointer hover:text-blue-700 transition"
                  onClick={() => handleMoveToCart(item)}
                />
                <HiMiniTrash
                  className="text-xl text-red-500 cursor-pointer hover:text-red-700 transition"
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to remove this item from your wishlist?"
                    );
                    if (confirmDelete) {
                      handleDeleteItem(item.id);
                      alert("Item removed from wishlist.");
                    }
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {wishlistItems.length > 0 && (
        <button
          className="mt-4 bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition"
          onClick={handleClearWishlist}
        >
          <HiTrash className="text-lg" /> Clear Wishlist
        </button>
      )}
    </div>
  );
};

export default Wishlist;
