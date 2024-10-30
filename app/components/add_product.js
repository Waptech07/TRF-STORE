import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, MenuItem } from '@mui/material';
import axios from 'axios';
import baseUrl from '../urls';
import { useSession } from 'next-auth/react';

const API_URL = `${baseUrl}api/v1/product/`;
const API_URL_CATEGORIES = `${baseUrl}api/v1/categories`;

export default function AddProduct({ onClose }) {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [size, setSize] = useState([]);
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            const response = await axios.get(API_URL_CATEGORIES);
            setCategories(response.data);
        }
        fetchCategories();
    }, []);

    const handleAddProduct = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("short_description", shortDescription);
        formData.append("long_description", longDescription);
        formData.append("category_id", categoryId);
        formData.append("discount_percent", discountPercent);
        size.forEach((sz) => formData.append("size", sz));
        imageFiles.forEach((file) => formData.append("image_files", file));

        await axios.post(API_URL, formData, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        onClose();
    };

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
                maxWidth: '90vw',  // Wider width
                maxHeight: '90vh', // Max height for vertical scrolling
                mx: "auto",
                p: 3,
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                boxShadow: 3,
                overflowY: 'auto'  // Enable vertical scroll if content overflows
            }}
        >
            <Typography variant="h5" color="primary" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                Add New Product
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Sizes (comma-separated)"
                        value={size.join(', ')}
                        onChange={(e) => setSize(e.target.value.split(', '))}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Short Description"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Long Description"
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        label="Category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        fullWidth
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Discount Percent" type="number" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        component="label"
                        color="secondary"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        Upload Images
                        <input type="file" hidden multiple onChange={(e) => setImageFiles(Array.from(e.target.files))} />
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddProduct}
                        fullWidth
                    >
                        Add Product
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
