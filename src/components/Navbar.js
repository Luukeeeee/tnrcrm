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

const Navbar = ({ user }) => {
  const [userMenu, setUserMenu] = useState(null);
  const navigation = useNavigate();

  const stringToColor = string => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const stringAvatar = name => {
    if (name) {
      return {
        sx: {
          bgcolor: stringToColor(name)
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
      };
    }
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

  return (
    <AppBar position="fixed" maxwidth="lg">
      <Container>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex' }}>
            <Avatar src="./img/tnr-log.png" alt="logo" variant="rounded" component={Link} to="/" />
            <Typography variant="h6" ml={1}>
              T & R Accountants
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                    <Avatar {...stringAvatar(user?.displayName)} />
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
