"use client";

import { useEffect, useState } from 'react';
import { Button, Box, Typography, Modal, Container } from '@mui/material';
import ProductList from '../../components/product_list';
import AddProduct from '../../components/add_product';
import Sidebar from '@/app/components/sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAddingProduct, setIsAddingProduct] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) router.push('/login');
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    const handleAddProductOpen = () => {
        setIsAddingProduct(true);
    };

    const handleAddProductClose = () => {
        setIsAddingProduct(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
            }}
        >
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
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', marginTop: 2 }}>Product Management</Typography>
                <Button variant="contained" color="primary" onClick={handleAddProductOpen} style={{ margin: '20px 0' }}>
                    Add Product
                </Button>
                <ProductList />
                <Modal open={isAddingProduct} onClose={handleAddProductClose}>
                    <AddProduct onClose={handleAddProductClose} />
                </Modal>
            </Box>
        </Box>
    );
}
