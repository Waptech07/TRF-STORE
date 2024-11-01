"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useSpring, animated } from 'react-spring';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        setIsAdmin(true);
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        const res = await fetch('https://trf-store-api.vercel.app/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, is_admin: isAdmin }),
        });

        const data = await res.json();

        if (res.ok) {
            router.push('/login');
        } else {
            setError(data.message || 'Registration failed');
        }
    };

    // Animation spring
    const props = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 500 } });

    return (
        <animated.div style={props} className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Typography variant="h4" className="mb-4">Register</Typography>
            <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
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
                    type="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isAdmin}
                            onChange={() => setIsAdmin(!isAdmin)}
                            color="primary"
                        />
                    }
                    label="Admin"
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="mt-4"
                >
                    Register
                </Button>
            </form>
        </animated.div>
    );
}
