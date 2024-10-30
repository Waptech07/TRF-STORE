"use client"

import React, { useState } from 'react';
import { Button, Box, Typography, Modal } from '@mui/material';
import ProductList from '../../components/product_list';
import AddProduct from '../../components/add_product';
import Sidebar from '@/app/components/sidebar';

export default function ProductsPage() {
    const [isAddingProduct, setIsAddingProduct] = useState(false);

    const handleAddProductOpen = () => {
        setIsAddingProduct(true);
    };

    const handleAddProductClose = () => {
        setIsAddingProduct(false);
    };

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
        }}>
            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                    m: 2,
                    boxShadow: 4,
                }}
            >
                <Typography variant="h4" sx={{marginTop: 2}}>Product Management</Typography>

                <Button variant="contained" color="primary" onClick={handleAddProductOpen} style={{ margin: '20px 0' }}>
                    Add Product
                </Button>

                <ProductList />

                <Modal open={isAddingProduct} onClose={handleAddProductClose}>
                    <Box style={{ width: 400, padding: 20, margin: '50px auto', background: '#fff' }}>
                        <Typography variant="h6" gutterBottom>Add New Product</Typography>
                        <AddProduct onClose={handleAddProductClose} />
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
}
