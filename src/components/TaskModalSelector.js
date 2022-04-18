import { Autocomplete, Grid, TextField } from '@mui/material';
import React, { useContext } from 'react';
import StaffsContext from '../context/StaffsContext';

const TaskModalSelector = ({ md, sx, label, task, name, setTask }) => {
  const staffs = useContext(StaffsContext);

  let selectorArray = [];
  staffs.forEach(staff => selectorArray.push({ name: staff.firstName + ' ' + staff.lastName, id: staff.uid }));
  
  return (
    <Grid item md={md} xs={sx}>
      <Autocomplete
        options={selectorArray}
        autoHighlight
        autoComplete
        renderInput={params => <TextField {...params} label={label} />}
        getOptionLabel={option => option.name}
        value={task?.[name]}
        name={name}
        onChange={(_event, option) => {
          setTask({ ...task, [name]: option });
        }}
      />
    </Grid>
  );
};

export default TaskModalSelector;
