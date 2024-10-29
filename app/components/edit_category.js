'use client';

import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import baseUrl from '../urls';

const EditCategory = ({ categoryId, onCategoryUpdated }) => {
    const { data: session } = useSession();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [image, setImage] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`${baseUrl}api/v1/category/${categoryId}`, {
                    headers: {
                        'Authorization': `Bearer ${session.accessToken}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch category');
                const data = await response.json();
                setCategory(data);
                setName(data.name);
                setDesc(data.desc);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [categoryId, session.accessToken]);

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
            const response = await fetch(`${baseUrl}api/v1/category/${categoryId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to update category');

            const updatedCategory = await response.json();
            onCategoryUpdated(updatedCategory);
            router.push('/admin/categories');
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
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant="h5" color="text.primary" textAlign="center" sx={{ fontWeight: 'bold' }}>
                        Edit Category
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
                            onChange={(e) => setImage(e.target.files[0])}
                            style={{ marginTop: '0.5rem', padding: '0.5rem 0', color: "black" }}
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
                                {loading ? <CircularProgress size={24} /> : 'Update Category'}
                            </Button>
                        </Box>
                        {error && <Typography color="error" textAlign="center">{error}</Typography>}
                    </form>
                </>
            )}
        </Container>
    );
};

export default EditCategory;
