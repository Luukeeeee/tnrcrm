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
import MenuIcon from '@mui/icons-material/Menu';

import { auth } from '../firebase';
import StaffAvatar from './StaffAvatar';
import ConditionRendering from './ConditionRendering';

const Navbar = ({ user }) => {
  const [menu, setMenu] = useState(null);
  const [userMenu, setUserMenu] = useState(null);
  const navigation = useNavigate();

  const handleOpenMenu = e => {
    setMenu(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenu(null);
  };

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

  const pages = [
    { page: 'Clients', path: '/clients' },
    { page: 'Staffs', path: '/staffs', access: ['Manager', 'Bookkeeper'] }
  ];

  return (
    <AppBar position="sticky" maxwidth="lg" sx={{mb: 4}}>
      <Container>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <IconButton onClick={handleOpenMenu} sx={{ p: 0.5, display: { xs: 'block', md: 'none' } }}>
              <MenuIcon color="action" />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu"
              anchorEl={menu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(menu)}
              onClose={handleCloseMenu}
            >
              {pages.map(page => (
                <MenuItem key={page.page} component={Link} to={page.path}>
                  <Typography textAlign="center" variant="subtitle2">
                    {page.page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Avatar src="./img/tnr-log.png" alt="logo" variant="rounded" component={Link} to="/" />
            <Typography variant="h4" ml={1}>
              T & R Accountants
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Avatar src="./img/tnr-log.png" alt="logo" variant="rounded" component={Link} to="/" />
            <Typography variant="h6" ml={1}>
              T & R Accountants
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(page => (
              <ConditionRendering conditionString={!page.access || page.access.includes(user.position)} key={page.page}>
                <Button
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block'
                  }}
                  component={Link}
                  to={page.path}
                >
                  {page.page}
                </Button>
              </ConditionRendering>
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
