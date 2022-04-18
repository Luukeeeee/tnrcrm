import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import React, { useContext, useState } from 'react';
import UserContext from '../context/UserContext';
import { addDocu, deleteDocu, updateDocu } from '../controllers/oneLevel';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const TaskRowCollapse = ({ open, item, memos }) => {
  const [price, setPrice] = useState(0);
  const [memo, setMemo] = useState('');
  const user = useContext(UserContext);
  const handleSubmit = e => {
    e.preventDefault();
    updateDocu('tasks', item.id, { invAmount: price }, setPrice(0));
  };
  const handleMemoSubmit = (e, id) => {
    e.preventDefault();
    memo !== '' && addDocu('taskMemos', { memo, taskId: id, personAdded: user?.displayName }, setMemo(''));
  };
  const handleMemoDelete = id => {
    deleteDocu('taskMemos', id);
  };
  console.log(memos)

  return (
    <Collapse in={open} timeout="auto" unmountOnExit sx={{ m: 2 }}>
      <Grid container>
        <Grid item md={2} xs={6}>
          <Grid
            container
            sx={{ mb: 2, display: user.position === 'Manager' || user.position === 'Admin' ? 'block' : 'none' }}
          >
            <Grid item md={5}>
              <form type="submit" onSubmit={handleSubmit}>
                <TextField
                  size="small"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  type="number"
                  variant="standard"
                  label="Set Price"
                  autoFocus
                />
              </form>
            </Grid>
            <Grid item md={6} sx={{ mt: 1 }}>
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Urgent"
                checked={item.urgent}
                onChange={() => updateDocu('tasks', item.id, { urgent: !item.urgent })}
              />
            </Grid>
          </Grid>
          {item.invAmount ? (
            <Typography variant="subtitle2">{`The charge would be $ ${item.invAmount}`}</Typography>
          ) : (
            <Typography variant="subtitle2">Haven't set price.</Typography>
          )}
          {item.urgent && (
            <Typography varient="subtitle2" color="red">
              Urgent!!
            </Typography>
          )}
        </Grid>
        <Divider orientation='vertical' flexItem sx={{display: {md: 'block', xs: 'none'}}} />
        <Grid item md={9} xs={12} sx={{ pl: {md: 4, xs: 0} }}>
          <Typography color="primary" varient="h6">
            Memos
          </Typography>
          <form action="submit" onSubmit={e => handleMemoSubmit(e, item.id)}>
            <Grid container>
              <TextField
                label="Add Memo"
                md={4}
                xs={8}
                variant="standard"
                size="small"
                autoFocus
                value={memo}
                onChange={e => setMemo(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary" sx={{ p: 0 }}>
                        <AddOutlinedIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </form>

          {memos
            .filter(memo => memo.taskId === item.id)
            .map(memo => (
              <Box sx={{ mt: 1 }} key={memo.id}>
                <Chip label={memo.memo} onDelete={() => handleMemoDelete(memo.id)} sx={{ p: -2 }} />
              </Box>
            ))}
        </Grid>
      </Grid>
    </Collapse>
  );
};

export default TaskRowCollapse;
