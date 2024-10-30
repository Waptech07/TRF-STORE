// Import relevant hooks and libraries
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, MenuItem, Input } from '@mui/material';
import axios from 'axios';
import baseUrl from '../urls';
import { useSession } from 'next-auth/react';

const API_URL_PRODUCTS = `${baseUrl}api/v1/product/`;
const API_URL_CATEGORIES = `${baseUrl}api/v1/categories`;

export default function EditProduct({ product, onCloseEdit }) {
    const { data: session } = useSession();
    const [productData, setProductData] = useState({
        name: product.name || '',
        short_description: product.short_description || '',
        long_description: product.long_description || '',
        price: product.price || '',
        stock: product.stock || '',
        discount_percent: product.discount_percent || 0,
        size: product.size || [],
        category_id: product.category_id || '',
    });
    const [categories, setCategories] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);

    // Fetch categories on component mount
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await axios.get(API_URL_CATEGORIES);
                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        }
        fetchCategories();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle image file selection
    const handleFileChange = (e) => {
        setImageFiles([...e.target.files]);
    };

    // Submit updated product data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in productData) {
            formData.append(key, productData[key]);
        }
        imageFiles.forEach((file) => formData.append('image_files', file));

        try {
            const res = await axios.put(`${API_URL_PRODUCTS}${product.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.status === 200) {
                onCloseEdit(); // Close the edit modal on success
            }
        } catch (error) {
            console.error("Error updating product", error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Edit Product</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Name"
                        name="name"
                        value={productData.name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Short Description"
                        name="short_description"
                        value={productData.short_description}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Long Description"
                        name="long_description"
                        value={productData.long_description}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={productData.price}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Stock"
                        name="stock"
                        type="number"
                        value={productData.stock}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Discount Percent"
                        name="discount_percent"
                        type="number"
                        value={productData.discount_percent}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Category"
                        name="category_id"
                        value={productData.category_id}
                        onChange={handleInputChange}
                        select
                        fullWidth
                        required
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Sizes (comma-separated)"
                        name="size"
                        value={productData.size.join(', ')}
                        onChange={(e) =>
                            setProductData((prevData) => ({
                                ...prevData,
                                size: e.target.value.split(',').map(s => s.trim()),
                            }))
                        }
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Input
                        type="file"
                        inputProps={{ multiple: true }}
                        onChange={handleFileChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Update Product
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
