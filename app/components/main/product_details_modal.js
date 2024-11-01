"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HiShoppingBag } from "react-icons/hi";
import { motion } from "framer-motion";

const ProductDetailsModal = ({ isOpen, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const productResponse = await fetch(
            `https://trf-store-api.vercel.app/api/v1/product/${productId}`
          );
          const productData = await productResponse.json();
          setProduct(productData);

          const categoryResponse = await fetch(
            `https://trf-store-api.vercel.app/api/v1/category/${productData.category_id}`
          );
          const categoryData = await categoryResponse.json();
          setCategoryName(categoryData.name);
        } catch (error) {
          console.error("Error fetching product or category:", error);
        }
      }
    };

    fetchProduct();
  }, [productId, isOpen]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Notify user to select a size
      alert("Please select a size before adding to the cart.");
      return;
    }

    const item = {
      id: product.id,
      name: product.name,
      price: product.discount_price,
      size: selectedSize,
      quantity: quantity,
    };

    // Get the current cart from local storage or initialize it
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.size === item.size
    );

    if (existingItemIndex > -1) {
      // Update the quantity if the item already exists
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      // Add the new item to the cart
      cart.push(item);
    }

    // Save the updated cart back to local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Optionally, you can show a message or notification here
    alert(`${item.quantity} ${item.name} added to cart.`);
  };

  const sliderSettings = {
    customPaging: (i) => (
      <a>
        <img
          src={product.image_files[i]}
          alt={`${product.name} ${i + 1}`}
          style={{ borderRadius: "4px" }}
        />
      </a>
    ),
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          ml: 2,
          fontWeight: "bold",
          color: "#333",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {product.name}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            color: "#555",
            "&:hover": { color: "black" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
          {/* Image Slider */}
          <Box flexShrink={0} width={{ xs: "100%", md: "50%" }} sx={{ px: 2 }}>
            <Slider {...sliderSettings}>
              {product.image_files.map((imageUrl, index) => (
                <div key={index}>
                  <img
                    src={imageUrl}
                    alt={`${product.name} image ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      p: "10px",
                    }}
                  />
                </div>
              ))}
            </Slider>
          </Box>

          {/* Product Information */}
          <Box flexGrow={1} sx={{ px: 2 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mb: 1, fontStyle: "italic", color: "#777" }}
            >
              Category: {categoryName}
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#000" }}>
              ₦{product.discount_price}{" "}
              <span style={{ color: "#777", textDecoration: "line-through" }}>
                ₦{product.price}
              </span>
              {product.discount_percent > 0 && (
                <span
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    padding: "2px 8px",
                    fontSize: "0.875rem",
                    borderRadius: "4px",
                    marginLeft: "8px",
                  }}
                >
                  -{product.discount_percent}%
                </span>
              )}
            </Typography>

            {/* Available Sizes */}
            <Box mt={3}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Available Sizes
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {product.size[0].split(",").map((size, index) => (
                  <Box
                    key={index}
                    sx={{
                      px: 2,
                      py: 1,
                      border: "1px solid #ddd",
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: selectedSize === size ? "#333" : "white",
                      color: selectedSize === size ? "white" : "#333",
                      borderRadius: "4px",
                      transition: "background-color 0.2s, color 0.2s",
                      "&:hover": { backgroundColor: "#333", color: "white" },
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={2} mt={4}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 p-3 text-white flex items-center justify-center cursor-pointer rounded-md"
                style={{ width: "100%" }}
                onClick={handleAddToCart}
              >
                <HiShoppingBag className="text-2xl" />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-gray-400 p-3 flex items-center justify-center cursor-pointer rounded-md"
                style={{
                  width: "100%",
                  color: "#555",
                }}
                onClick={() => {
                  // Handle favourite action
                }}
              >
                <FaHeart className="text-2xl" />
              </motion.div>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#ddd" }} />

            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Short Description
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {product.short_description}
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Long Description
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.long_description}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
