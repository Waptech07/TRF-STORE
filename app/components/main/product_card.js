"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { HiShoppingBag } from "react-icons/hi2";
import ProductDetailsModal from "./product_details_modal";

const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        className="bg-white flex flex-col border-gray-950"
        whileHover={{ borderWidth: "1px" }}
        transition={{ duration: 0.1 }}
      >
        <motion.div whileHover={{ scale: 0.9 }} transition={{ duration: 0.1 }}>
          <div className="relative w-full h-52">
            <Image
              src={product?.image_files[0] || product?.image_files[1]}
              alt={product.name}
              layout="fill"
              objectFit="contain"
              className="transition-transform duration-300 ease-in-out"
            />
          </div>
          <div className="my-4 mx-2 flex items-center justify-between">
            <h2 className=" text-lg font-semibold text-black">
              {product.name}
            </h2>
            <p className="text-gray-700">₦{product.price}</p>
          </div>
        </motion.div>
        <div className="w-full flex justify-between bg-white">
          <motion.div
            onClick={handleOpenModal}
            className="bg-gray-950 p-2 text-white flex hover:bg-gray-600 cursor-pointer"
          >
            <HiInformationCircle className="text-2xl" />
          </motion.div>

          <motion.div className="bg-gray-950 p-2 text-white flex hover:bg-gray-800 cursor-pointer">
            <HiShoppingBag className="text-2xl" />
          </motion.div>
        </div>
      </motion.div>
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productId={product.id} // Pass product ID to fetch details
      />
    </>
  );
};

export default ProductCard;
