'use client';

import { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Box,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import baseUrl from '../urls';

const AddCategory = ({ onCategoryAdded }) => {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('desc', desc);
        if (image) {
            formData.append('image_file', image);
        }

        try {
            const response = await fetch(`${baseUrl}api/v1/category`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Failed to create category. Status: ${response.status}. Details: ${errorDetails}`);
            }

            const newCategory = await response.json();
            onCategoryAdded(newCategory);
            setName('');
            setDesc('');
            setImage(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: 3,
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
        }}>
            <Typography variant="h5" color="text.primary" textAlign="center" sx={{ fontWeight: 'bold' }}>
                Add New Category
            </Typography>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <TextField
                    label="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ marginTop: '0.5rem', padding: '0.5rem 0', color: "black", }}
                />
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        fullWidth
                        sx={{ py: 1.5, fontWeight: 'bold' }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Add Category'}
                    </Button>
                </Box>
                {error && <Typography color="error" textAlign="center">{error}</Typography>}
            </form>
        </Container>
    );
};

export default AddCategory;
