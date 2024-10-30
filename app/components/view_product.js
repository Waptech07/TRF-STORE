"use client" ;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, Box, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import EditProduct from './edit_product';
import baseUrl from '../urls';

export default function ViewProduct({ product, onClose, onProductUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        const fetchCategoryName = async () => {
            try {
                const response = await axios.get(`${baseUrl}api/v1/category/${product.category_id}`);
                setCategoryName(response.data?.name || 'No category available');
            } catch (error) {
                console.error("Error fetching category:", error);
                setCategoryName('No category available');
            }
        };

        if (product.category_id) {
            fetchCategoryName();
        }
    }, [product.category_id]);

    // Callback for when the edit is completed
    const handleEditComplete = () => {
        handleEditToggle();
        onProductUpdate();
    };

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="span">Product Details</Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
                {isEditing ? (
                    <EditProduct product={product} onCloseEdit={handleEditComplete} />
                ) : (
                    <Box>
                        <Box mb={2} display="flex" flexDirection="column" gap={1} alignItems="flex-start">
                            <Typography variant="h5" color="textPrimary" gutterBottom>{product.name}</Typography>
                            <Typography variant="body1" color="textSecondary">{product.short_description}</Typography>
                        </Box>

                        <Divider sx={{ marginBottom: 2 }} />

                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                            <Box>
                                <Typography variant="subtitle1" color="textSecondary">Price</Typography>
                                <Typography variant="h6" color="primary">${product.price}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" color="textSecondary">Stock</Typography>
                                <Typography variant="h6" color="primary">{product.stock}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" color="textSecondary">Category</Typography>
                                <Typography variant="body1">{categoryName}</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box>
                            <Typography variant="subtitle1" color="textSecondary">Sizes</Typography>
                            <List sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, padding: 0 }}>
                                {product.size?.map((size, index) => (
                                    <ListItem key={index} sx={{ backgroundColor: '#e0e0e0', borderRadius: '4px', padding: '4px 12px' }}>
                                        <ListItemText primary={size} sx={{ textAlign: 'center' }} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        <Divider sx={{ my: 3 }} />
                        <Box>
                            <Typography variant="subtitle1" color="textSecondary">Images</Typography>
                            <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
                                {product.image_files?.length > 0 ? (
                                    product.image_files.map((url, index) => (
                                        <Box key={index} sx={{ width: '100px', height: '100px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #ddd' }}>
                                            <img src={url} alt={`Product image ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">No images available</Typography>
                                )}
                            </Box>
                        </Box>
                        <Divider sx={{ my: 3 }} />
                        <Box>
                            <Typography variant="subtitle1" color="textSecondary">Image URLs</Typography>
                            <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
                                {product.image_urls?.length > 0 ? (
                                    product.image_urls.map((url, index) => (
                                        <Box key={index} sx={{ width: '100px', height: '100px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #ddd' }}>
                                            <img src={url} alt={`Product image ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">No images available</Typography>
                                )}
                            </Box>
                        </Box>

                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
                {isEditing ? (
                    <Button onClick={handleEditToggle} variant="outlined" color="primary">Cancel</Button>
                ) : (
                    <Button onClick={handleEditToggle} variant="contained" color="primary" startIcon={<EditIcon />}>Edit</Button>
                )}
                <Button onClick={onClose} variant="contained" color="secondary">Close</Button>
            </DialogActions>

        </Dialog>
    );
}
