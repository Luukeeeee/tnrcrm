import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

const Selector = ({ grid = 12, id, name, value, handleChange, items }) => {
  return (
    <Grid item xs={12} sm={grid}>
      <FormControl fullWidth>
        <InputLabel id={id}>{name}</InputLabel>
        <Select labelId={id} value={value} label={name} onChange={handleChange} required>
          {items.map((item, i) => (
            <MenuItem value={item} key={i}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default Selector;
