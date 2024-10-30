import { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Toolbar,
    IconButton,
    Box,
    useMediaQuery,
    Typography,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, Category, ShoppingCart } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 250;

export default function Sidebar() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(true);

    const menuItems = [
        { text: 'Categories', icon: <Category />, path: '/admin/categories' },
        { text: 'Products', icon: <ShoppingCart />, path: '/admin/products' },
    ];

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <IconButton
                onClick={toggleDrawer}
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: open ? (isMobile ? 16 : drawerWidth + 16) : 16,
                    zIndex: 1000,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    m: 1,
                }}
            >
                {open ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={open}
                onClose={toggleDrawer}
                sx={{
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        p: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 2,
                        margin: '16px 16px 16px 8px',
                        height: 'calc(100vh - 32px)',
                        boxShadow: theme.shadows[3],
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    },
                }}
            >
                <Toolbar />
                <List>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main'}}>Welcome Admin</Typography>
                    {menuItems.map((item, index) => (
                        <ListItem
                            key={index}
                            button={true}
                            onClick={() => router.push(item.path)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}
