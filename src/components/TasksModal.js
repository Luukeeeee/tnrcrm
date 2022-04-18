import { Box, Modal, Typography, Grid, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { addDocu } from '../controllers/oneLevel';
import Input from './Input';
import Selector from './Selector';

import style from './styles/modalStyles';
import TaskModalSelector from './TaskModalSelector';

const TasksModal = ({ taskShow, setTaskShow, client, setClient }) => {
  const [taskType, setTaskType] = useState('BAS');
  let today = new Date().toISOString();
  const currentYear = today.slice(0, 4);
  const lastYear = (currentYear - 1).toString();
  const currentDate = today.slice(0, 10);
  let basPeriodArray = [];
  let taxReturnPeriodArray = [currentYear, lastYear];
  const formBasPeriodArray = () => {
    const shortFormCY = currentYear.slice(2, 4);
    const shortFormLY = lastYear.slice(2, 4);
    let periodArray = [
      { string: currentYear + '-12-31', period: 'DEC-' + shortFormCY },
      { string: currentYear + '-09-30', period: 'SEP-' + shortFormCY },
      { string: currentYear + '-06-30', period: 'JUN-' + shortFormCY },
      { string: currentYear + '-03-31', period: 'MAR-' + shortFormCY },
      { string: lastYear + '-12-31', period: 'DEC-' + shortFormLY },
      { string: lastYear + '-09-30', period: 'SEP-' + shortFormLY },
      { string: lastYear + '-06-30', period: 'JUN-' + shortFormLY },
      { string: lastYear + '-03-31', period: 'MAR-' + shortFormLY }
    ];
    periodArray.forEach(item => {
      if (item.string < currentDate) {
        basPeriodArray.push(item.period);
      }
    });
  };
  formBasPeriodArray();

  const [task, setTask] = useState({});

  useEffect(() => {
    setTask({
      clientName: client?.businessName,
      clientId: client?.id,
      taskType: 'BAS',
      period: '',
      estimate: false,
      estimateId: { name: '', id: '' },
      estimateApproved: false,
      formPrepared: false,
      invoiced: false,
      paid: false,
      lodged: false,
      bookkept: false,
      bookkeeperId: { name: '', id: '' },
      statementPrepared: false,
      accountantId: { name: '', id: '' },
      taskFinished: false,
      urgent: {
        status: false,
        createdAt: ''
      }
    });
  }, [taskShow]);

  useEffect(() => {
    if (taskType === 'BAS') {
      setTask({
        clientName: client?.businessName,
        clientId: client?.id,
        taskType: 'BAS',
        period: '',
        estimate: false,
        estimateId: { name: '', id: '' },
        estimateApproved: false,
        formPrepared: false,
        invoiced: false,
        paid: false,
        lodged: false,
        bookkept: false,
        bookkeeperId: { name: '', id: '' },
        statementPrepared: false,
        accountantId: { name: '', id: '' },
        taskFinished: false,
        urgent: {
          status: false,
          createdAt: ''
        }
      });
    } else if (taskType === 'Tax Return') {
      setTask({
        clientName: client?.businessName,
        clientId: client?.id,
        taskType,
        period: '',
        clientType: client?.clientType,
        accountantId: { name: '', id: '' },
        formPrepared: false,
        invoiced: false,
        paid: false,
        lodged: false,
        statementPrepared: false,
        taskFinished: false,
        urgent: {
          status: false,
          createdAt: ''
        }
      });
    } else {
      setTask({
        clientName: client?.businessName,
        clientId: client?.id,
        taskType,
        taskName: '',
        clientType: client?.clientType,
        accountantId: { name: '', id: '' },
        taskPrepared: false,
        invoiced: false,
        paid: false,
        lodged: false,
        taskFinished: false,
        urgent: {
          status: false,
          createdAt: ''
        }
      });
    }
  }, [taskType]);

  const handleClose = () => {
    setTaskShow(false);
    setClient(null);
  };

  const handleChange = e => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const thenFunc = () => {
    setTask({
      taskType: 'BAS',
      period: '',
      estimate: false,
      estimateId: { name: '', id: '' },
      estimateApproved: false,
      formPrepared: false,
      invoiced: false,
      paid: false,
      lodged: false,
      bookkept: false,
      bookkeeperId: { name: '', id: '' },
      statementPrepared: false,
      accountantId: { name: '', id: '' },
      taskFinished: false,
      urgent: {
        status: false,
        createdAt: ''
      }
    });
    handleClose();
  };

  const handleSubmit = e => {
    e.preventDefault();
    setTaskShow({ ...task, clientName: client?.businessName, clientId: client?.id });
    addDocu('tasks', task, thenFunc());
  };

  return (
    <Modal open={taskShow} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" color="primary" mb={2}>
          Add Task for {client?.businessName}
        </Typography>
        <form action="submit" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Selector
              grid={3}
              id="taskType"
              name="taskType"
              label="Task Type"
              value={taskType}
              items={['BAS', 'Tax Return', 'Grant', 'Insurance', 'Other']}
              handleChange={e => setTaskType(e.target.value)}
            />
            {taskType === 'Tax Return' || taskType === 'BAS' ? (
              <Selector
                grid={3}
                id="period"
                name="period"
                label={taskType === 'BAS' ? 'Period' : 'Year'}
                value={task?.period}
                items={taskType === 'BAS' ? basPeriodArray : taxReturnPeriodArray}
                handleChange={handleChange}
              />
            ) : null}
            {taskType !== 'BAS' && taskType !== 'Tax Return' && (
              <Input
                grid={8}
                gridxs={12}
                name="taskName"
                value={task?.taskName}
                handleChange={handleChange}
                label="Task Name"
              />
            )}
            {taskType === 'BAS' && (
              <>
                <TaskModalSelector md={4} sx={12} label="Estimate" task={task} name="estimateId" setTask={setTask} />
                <TaskModalSelector
                  md={4}
                  sx={12}
                  label="Bookkeeper"
                  task={task}
                  name="bookkeeperId"
                  setTask={setTask}
                />
              </>
            )}
            <TaskModalSelector md={6} sx={12} label="Accountant" task={task} name="accountantId" setTask={setTask} />
          </Grid>
          <Button type="submit" sx={{ float: 'right', mt: 2 }}>
            Add
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default TasksModal;
