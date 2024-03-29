import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import Drawer from '@mui/material/Drawer';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


function NavBar() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const navigate = useNavigate();

    const logOutUser = (e) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure to logout ?',
            text: 'This action cannot be undone!',
            showCancelButton: true,
            confirmButtonText: 'Yes, Logout!',
            cancelButtonText: 'No, keep it',
            confirmButtonColor: '#FF0000',
            cancelButtonColor: '#333333',
        }).then((result) => {
            if (result.isConfirmed) {

                handlelogOutUser(e);
            }
        });
    }

    const viewProfile = () => {
        navigate('/profile')
    }

    const handlelogOutUser = (e) => {
        e.preventDefault();
        localStorage.removeItem('dtoken');
        navigate('/login');
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >

            <MenuItem onClick={viewProfile}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>

        </Menu>
    );

    const getNavigationLinks = () => {
        return (
            <>
                <MenuItem onClick={() => navigate('/home')}  >
                    Home
                </MenuItem>
                <MenuItem onClick={() => navigate('/profile')} >
                    Profile
                </MenuItem>
                <MenuItem onClick={() => navigate('/chat-room')}>
                    Chat Room
                </MenuItem>
                <MenuItem onClick={logOutUser}>
                    Logout
                </MenuItem>
            </>
        );
    }

    return (
        <Box sx={{ position: 'sticky', top: 0, zIndex: 999, flexGrow: 2 }} >
            <AppBar position="sticky" sx={{ backgroundColor: '#b0dce4', height: '65px' }} >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="black"
                        aria-label="open drawer"
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img src="/jjmlogo.png" className='rounded-3' alt="Logo" style={{ height: 40, marginRight: 10 }} />
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            color="inherit"
                            onClick={viewProfile}
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerClose}
                color="inherit"
            >
                <img src="/jjm-logo.png" className='rounded-3' alt="Logo" style={{ height: '200px', marginRight: 0 }} />
                {getNavigationLinks()}
                <MenuItem onClick={handleDrawerClose}>
                    Close
                </MenuItem>
            </Drawer>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    )
}

export default NavBar