import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Container,
  Toolbar,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { auth } from '../firebase';
import StaffAvatar from './StaffAvatar';

const Navbar = ({ user }) => {
  const [userMenu, setUserMenu] = useState(null);
  const navigation = useNavigate();

  const handleOpenUserMenu = e => {
    setUserMenu(e.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenu(null);
  };

  const logout = () => {
    signOut(auth).then(() => setUserMenu(null));
    navigation('/auth');
  };

  const pages = [{ page: 'Clients', path: '/clients' }];

  return (
    <AppBar position="fixed" maxwidth="lg">
      <Container>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex' }}>
            <Avatar src="./img/tnr-log.png" alt="logo" variant="rounded" component={Link} to="/" />
            <Typography variant="h4" ml={1} mr={2}>
              T & R Accountants
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(page => (
              <Button key={page.page} sx={{ my: 2, color: 'white', display: 'block' }} component={Link} to={page.path}>
                {page.page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                    <StaffAvatar displayName={user?.displayName} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={userMenu}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={Boolean(userMenu)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={logout}>
                    <Typography textAlign="center" variant="subtitle2">
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button variant="contained" component={Link} to="/auth" color="secondary" size="small" disableElevation>
                  sign in
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
