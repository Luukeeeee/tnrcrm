import { Grid, Paper, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

import snapShot from '../../controllers/snapshotListener';
import BASRow from '../BASRow';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [memos, setMemos] = useState([]);

  useEffect(() => {
    snapShot('tasks', setTasks, 'createdAt');
    snapShot('taskMemos', setMemos, 'createdAt', true);
    return () => {
      setTasks([]);
      setMemos([]);
    };
  }, []);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" color="primary">
        Tasks
      </Typography>
      <Grid container>
        {tasks.map(item => (
          <BASRow item={item} key={item.id} memos={memos} />
        ))}
      </Grid>
    </Paper>
  );
};

export default Tasks;
