"use client";

import { useState, useEffect } from "react";
import Navbar from "../app/components/main/navbar";
import ProductCard from "../app/components/main/product_card";
import { motion } from "framer-motion";
import { BiFilter } from "react-icons/bi";
import axios from "axios";
import baseUrl from "./urls";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Fetch categories
    axios
      .get(`${baseUrl}api/v1/categories`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch products
    axios
      .get(`${baseUrl}api/v1/products`)
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Filter products by category
  const handleCategoryFilter = (categoryId) => {
    if (categoryId === selectedCategory || categoryId === null) {
      setSelectedCategory(null);
      setFilteredProducts(products);
    } else {
      setSelectedCategory(categoryId);
      setFilteredProducts(
        products.filter((product) => product.category_id === categoryId)
      );
    }
    // setIsFilterOpen(false);
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <div className="flex justify-between items-center mb-10">
          <motion.h1
            className="text-3xl font-bold text-gray-800 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Shop Products
          </motion.h1>
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <BiFilter
              className="text-3xl text-black cursor-pointer"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            />
            {isFilterOpen && (
              <motion.div
                className="absolute right-0 mt-2 bg-gray-50 border border-white shadow-lg z-10 w-32"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-500 ${
                    selectedCategory === null ? "bg-gray-700 text-white" : ""
                  }`}
                  onClick={() => handleCategoryFilter(null)}
                >
                  All
                </div>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-500 ${
                      selectedCategory === category.id ? "bg-gray-700 text-white" : ""
                    }`}
                    onClick={() => handleCategoryFilter(category.id)}
                  >
                    {category.name}
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
        <div className="pb-10">
          
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {filteredProducts.map((product) => (
            <motion.div
            key={product.id}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
          </div>
      </div>
    </div>
  );
}
