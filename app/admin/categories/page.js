'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container, Box, Toolbar, Typography } from '@mui/material';
import Sidebar from '../../components/sidebar';
import CategoryList from '../../components/category_list';

export default function CategoriesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (status !== 'loading' && !session) {
            router.push('/admin/login');
        }
    }, [session, status, router]);

    if (!isMounted || status === 'loading') {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

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
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', marginTop: 2 }}>Category Management</Typography>
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <CategoryList />
                </Container>
                <Toolbar />
            </Box>
        </Box>
    );
}
