'use client';

import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Button,
    Box,
    useMediaQuery,
    IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import AddCategory from './add_category';
import EditCategory from './edit_category';
import baseUrl from '../urls';
import { useSession } from 'next-auth/react';

const API_URL = `${baseUrl}api/v1/categories`;
const API_DELETE_URL = `${baseUrl}api/v1/category`;

export default function CategoryList() {
    const router = useRouter();
    const { data: session } = useSession();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    const handleCategoryAdded = (newCategory) => {
        setCategories([...categories, newCategory]);
    };

    const handleCategoryUpdated = (updatedCategory) => {
        setCategories(categories.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat)));
        setEditMode(false);
    };

    const handleEditClick = (categoryId) => {
        setCurrentCategoryId(categoryId);
        setEditMode(true);
    };

    const handleDelete = async (categoryId) => {
        try {
            const response = await fetch(`${API_DELETE_URL}/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete category');
            // Update categories after deletion
            setCategories(categories.filter(category => category.id !== categoryId));
        } catch (err) {
            console.error("Error deleting category:", err.message);
            setError('Failed to delete category');
        }
    };

    if (loading) {
        return (
            <Container sx={{ marginTop: '2rem', textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6">Loading categories...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ marginTop: '2rem', textAlign: 'center' }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" sx={{ flexDirection: 'column', gap: 2, mb: 3 }}>
                <Box sx={{ flexGrow: 1 }}>
                    {editMode ? (
                        <EditCategory categoryId={currentCategoryId} onCategoryUpdated={handleCategoryUpdated} />
                    ) : (
                        <AddCategory onCategoryAdded={handleCategoryAdded} />
                    )}
                </Box>
                {editMode ? (
                    <Button variant="contained" color="primary" onClick={() => setEditMode(false)} sx={{ alignSelf: isMobile ? 'center' : 'flex-start' }}>
                        Add Category
                    </Button>

                ) : (
                    ''
                )}
            </Box>
            <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: '8px', backgroundColor: 'background.paper' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id} hover sx={{ transition: 'background-color 0.3s' }}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.desc || 'N/A'}</TableCell>
                                <TableCell>
                                    <img src={category.image_file} alt={category.name} style={{ width: 50, height: 50, borderRadius: 4 }} />
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleEditClick(category.id)}>
                                        Edit
                                    </Button>
                                    <IconButton color="error" onClick={() => handleDelete(category.id)} sx={{ ml: 1 }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
