import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Input = ({ grid = 12, name, label, autoFocus, type, handleChange, handleShowPassword, value }) => {
  return (
    <Grid item xs={12} sm={grid}>
      <TextField
        name={name}
        onChange={handleChange}
        variant="outlined"
        value={value}
        required
        fullWidth
        label={label}
        autoFocus={autoFocus}
        type={type}
        InputProps={
          name === 'password'
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword}>
                      {type === 'password' ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            : null
        }
      ></TextField>
    </Grid>
  );
};

export default Input;
