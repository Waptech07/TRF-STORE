"use client";

import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Typography, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useSpring, animated } from 'react-spring';

import { FaTshirt, FaShoppingBag, FaShoePrints, FaHatCowboy } from 'react-icons/fa';

const icons = [
    { Icon: FaTshirt, className: 'text-white animate-float', style: { top: '10%', left: '5%', fontSize: '3rem' } },
    { Icon: FaShoppingBag, className: 'text-red-500 animate-float', style: { top: '20%', right: '5%', fontSize: '2.5rem' } },
    { Icon: FaShoePrints, className: 'text-indigo-900 animate-float', style: { bottom: '15%', left: '20%', fontSize: '4rem' } },
    { Icon: FaHatCowboy, className: 'text-yellow-500 animate-float', style: { bottom: '10%', right: '10%', fontSize: '3rem' } },
];


export default function LoginPage() {
    const { data: session, status } = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/admin/categories');
        }        
    }, [status, router]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });
        setLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            router.push('/admin/categories');
        }
    };

    const props = useSpring({ opacity: isMounted ? 1 : 0, from: { opacity: 0 }, config: { duration: 500 } });

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <animated.div style={props} className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
            {icons.map(({ Icon, className, style }, index) => (
                <Icon key={index} className={`absolute ${className}`} style={style} />
            ))}
            <Typography variant="h4" className="mb-4 text-white">Admin Login</Typography>
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
                <TextField
                    type="text"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    type="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<LockIcon />}
                    className="mt-4"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
            </form>
        </animated.div>
    );
}
