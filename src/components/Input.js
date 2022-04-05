import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Input = ({
  gridxs = 12,
  grid = 12,
  name,
  label,
  autoFocus,
  type,
  handleChange,
  handleShowPassword,
  value,
  required = true,
  variant,
  size
}) => {
  return (
    <Grid item xs={gridxs} sm={grid}>
      <TextField
        name={name}
        onChange={handleChange}
        variant={variant}
        value={value}
        required={required}
        fullWidth
        label={label}
        autoFocus={autoFocus}
        type={type}
        size={size}
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
