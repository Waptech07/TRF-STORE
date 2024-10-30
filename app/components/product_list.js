"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import ViewProduct from './view_product';
import axios from 'axios';
import baseUrl from '../urls';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';

const API_URL_PRODUCTS = `${baseUrl}api/v1/products`;
const API_URL_CATEGORIES = `${baseUrl}api/v1/categories`;
const API_DELETE_URL_PRODUCT = `${baseUrl}api/v1/product`;

export default function ProductList() {
    const { data: session } = useSession();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = async () => {
        const response = await axios.get(API_URL_PRODUCTS);
        setProducts(response.data);
    };

    const fetchCategories = async () => {
        const response = await axios.get(API_URL_CATEGORIES);
        const categoryMap = response.data.reduce((map, category) => {
            map[category.id] = category.name;
            return map;
        }, {});
        setCategories(categoryMap);
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`${API_DELETE_URL_PRODUCT}/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                },
            });
            setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    // Function to update the product list after an edit
    const handleProductUpdate = async () => {
        await fetchProducts(); // Re-fetch products after update
    };

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{categories[product.category_id] || 'Unknown'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewProduct(product)}
                                    >
                                        View
                                    </Button>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedProduct && (
                <ViewProduct
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onProductUpdate={handleProductUpdate}
                />
            )}
        </Box>
    );
}
