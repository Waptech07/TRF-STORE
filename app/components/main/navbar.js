"use client";

import { useState, useEffect } from "react";
import { HiShoppingCart } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import LogoWhite from "../../../assets/logo/trf_logo_white.png";
import LogoBlack from "../../../assets/logo/trf_logo_black.png";
import baseUrl from "../../urls";
import ProductDetailsModal from "./product_details_modal";
import Cart from "./cart";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isSmallScreen = useMediaQuery("(max-width: 700px)");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch all products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${baseUrl}api/v1/products`),
          axios.get(`${baseUrl}api/v1/categories`),
        ]);

        setAllProducts(productsResponse.data);
        setAllCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter search results based on searchTerm
  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();

      const filteredProducts = allProducts.filter(
        (product) =>
          product.name?.toLowerCase().includes(lowercasedTerm) ||
          product.shortDescription?.toLowerCase().includes(lowercasedTerm) ||
          product.longDescription?.toLowerCase().includes(lowercasedTerm) ||
          product.price?.toString().includes(lowercasedTerm)
      );

      const filteredCategories = allCategories.filter((category) =>
        category.name.toLowerCase().includes(lowercasedTerm)
      );

      setSearchResults([
        ...filteredProducts.map((product) => ({
          ...product,
          type: "product",
        })),
        ...filteredCategories.map((category) => ({
          ...category,
          type: "category",
        })),
      ]);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allProducts, allCategories]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all ${
          scrolled ? "shadow-md py-3 bg-black" : "py-4 bg-white border-b-2"
        } ${isSmallScreen ? "rounded-b-2xl" : ""}`}
      >
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <a href="/">
            <Image
              src={scrolled ? LogoBlack : LogoWhite}
              alt={"TRF LOGO"}
              width={80}
              className="cursor-pointer"
              loading="lazy"
            />
          </a>

          {/* Search bar */}
          <div className="relative flex items-center">
            {isSmallScreen ? (
              <div className="relative">
                {isSearchOpen ? (
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-40 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-black transition-width duration-200 ease-in-out"
                    onBlur={() => setIsSearchOpen(false)}
                    autoFocus
                  />
                ) : (
                  <BiSearch
                    className={`text-2xl ${
                      scrolled ? "text-white" : "text-black"
                    } cursor-pointer`}
                    onClick={() => setIsSearchOpen(true)}
                  />
                )}
              </div>
            ) : (
              <div className="relative w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                />
                <BiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            )}

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div
                className={`absolute top-full left-0 mt-2 w-full bg-white shadow-lg border border-gray-300 z-50 overflow-hidden transition-all duration-300 ease-in-out transform ${
                  searchResults.length > 0
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="px-4 py-2 hover:bg-gray-500 cursor-pointer transition-colors duration-200 ease-in-out"
                    onClick={() => {
                      setSearchResults([]);
                      setSearchTerm("");
                    }}
                  >
                    {result.type === "product" ? (
                      <>
                        <div
                          className="flex"
                          onClick={() => {
                            handleOpenModal();
                            setProductId(result.id);
                          }}
                        >
                          <Image
                            src={result.image_files[0]}
                            alt={result.name}
                            width={50}
                            height={50}
                            className="rounded-md mr-4"
                          />
                          <div className="flex-1">
                            <strong className="text-sm">{result.name}</strong>
                            <p className="font-bold text-black">
                              ₦{result.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex">
                          <div className="flex-1">
                            <p className="text-sm">Category</p>
                            <span className="font-bold text-black">
                              {result.name}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shopping Cart Icon */}
          <HiShoppingCart
            className={`text-3xl cursor-pointer ${
              scrolled ? "text-white" : "text-black"
            }`}
            onClick={toggleCart}
          />
        </div>
      </nav>
      {isCartOpen && (
        <Cart cartItems={cartItems} onClose={toggleCart} /> // Render the Cart component
      )}
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productId={productId}
      />
    </>
  );
}
