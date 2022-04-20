import { Grid, Paper, Typography } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';

import snapShot from '../../controllers/snapshotListener';
import BASRow from '../BASRow';
import TAXRow from '../TAXRow';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [memos, setMemos] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    snapShot('tasks', setTasks, 'createdAt');
    snapShot('taskMemos', setMemos, 'createdAt', true);
    return () => {
      setTasks([]);
      setMemos([]);
    };
  }, []);

  return (
    <Paper variant="outlined" sx={{ p: 2, maxHeight: { md: 400, xs: 700 }, overflowY: 'scroll' }}>
      <Typography variant="h6" color="primary">
        Tasks
      </Typography>
      <Grid container>
        {tasks
          .filter(task =>
            user.position === 'Manager' || user.position === 'Admin'
              ? task.clientId
              : [task?.estimateId?.id, task?.bookkeeperId?.id, task?.accountantId?.id].includes(user.uid)
          )
          .map(item =>
            item.taskType === 'BAS' ? (
              <BASRow item={item} key={item.id} memos={memos} />
            ) : item.taskType === 'Tax Return' ? (
              <TAXRow item={item} key={item.id} memos={memos} isOther={false} />
            ) : (
              <TAXRow item={item} key={item.id} memos={memos} isOther={true} />
            )
          )}
      </Grid>
    </Paper>
  );
};

export default Tasks;
