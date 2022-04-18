import { Autocomplete, Box, Checkbox, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import styles from './styles/tasksPageStyles';
import { updateDocu } from '../controllers/oneLevel';
import UserContext from '../context/UserContext';
import StaffsContext from '../context/StaffsContext';
import TaskRowCollapse from './TaskRowCollapse';

const StaffSelector = ({ value, id, columnName }) => {
  const staffs = useContext(StaffsContext);

  let selectorArray = [];
  staffs.forEach(staff => selectorArray.push({ name: staff.firstName + ' ' + staff.lastName, id: staff.uid }));

  return (
    <Autocomplete
      options={selectorArray}
      autoHighlight
      autoComplete
      renderInput={params => (
        <div ref={params.InputProps.ref}>
          <input type="text" {...params.inputProps} style={{ width: '70px', fontSize: '1px' }} />
        </div>
      )}
      getOptionLabel={option => option.name}
      value={value}
      onChange={(_event, option) => {
        if (option !== null) {
          updateDocu('tasks', id, { [columnName]: option });
        } else {
          updateDocu('tasks', id, { [columnName]: { name: '', id: '' } });
        }
      }}
    />
  );
};

const BASRow = ({ item, memos }) => {
  const [open, setOpen] = useState(false);
  const user = useContext(UserContext);

  const handleChange = (allocated, itemId, columnId, checked, columnName) => {
    if (allocated) {
      if (columnId === user.uid) {
        updateDocu('tasks', itemId, { [columnName]: !checked });
      } else {
        alert('You cannot change it');
      }
    } else {
      if (columnId === 'primary') {
        if (user.position === 'Manager' || user.position === 'Admin') {
          updateDocu('tasks', itemId, { [columnName]: !checked });
        } else {
          alert('Only manager or admin can change it');
        }
      } else if (columnId === 'receivable') {
        if (user.position === 'Receivable') {
          updateDocu('tasks', itemId, { [columnName]: !checked });
        } else {
          alert('Only account receivable can change it');
        }
      }
    }
  };

  return (
    <Grid item md={12} xs={12} sx={styles.taskRow}>
      <Paper sx={{ overflow: 'hidden' }}>
        <Grid container>
          <Grid item md={2.132} xs={8}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                <IconButton aria-label="expand row" size="small" sx={{ p: 0, mb: -0.6 }} onClick={() => setOpen(!open)}>
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                Client Name
              </Typography>
              <Typography variant="caption" sx={styles.textCell}>
                {item.clientName}
              </Typography>
            </Box>
          </Grid>
          <Grid item md={0.5} xs={1.8}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                Type
              </Typography>
              <Typography variant="caption" sx={styles.textCell}>
                {item.taskType}
              </Typography>
            </Box>
          </Grid>
          <Grid item md={0.6} xs={2.2}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                Period
              </Typography>
              <Typography variant="caption" sx={styles.textCell}>
                {item.period}
              </Typography>
            </Box>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item md={1.7} xs={12}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                Estimate By
              </Typography>
              <Box sx={styles.textCell}>
                {user.position === 'Manager' || user.position === 'Admin' ? (
                  <StaffSelector value={item.estimateId} id={item.id} columnName="estimateId" />
                ) : (
                  <Typography variant="caption">{item.estimateId.name}</Typography>
                )}
                {item.estimateId.id !== '' && (
                  <Checkbox
                    checked={item.estimate}
                    size="small"
                    sx={styles.taskCheckBox}
                    onChange={() => handleChange(true, item.id, item.estimateId.id, item.estimate, 'estimate')}
                  />
                )}
              </Box>
            </Box>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item md={0.7} xs={2.4}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                EstApr
              </Typography>
              <Checkbox
                checked={item.estimateApproved}
                size="small"
                sx={styles.checkBox}
                onChange={() => handleChange(false, item.id, 'primary', item.estimateApproved, 'estimateApproved')}
              />
            </Box>
          </Grid>
          <Grid item md={0.53} xs={2.4}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                Form
              </Typography>
              <Checkbox
                checked={item.formPrepared}
                size="small"
                sx={styles.checkBox}
                onChange={() => handleChange(true, item.id, item.estimateId.id, item.formPrepared, 'formPrepared')}
              />
            </Box>
          </Grid>
          <Grid item md={0.53} xs={2.4}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                Inv
              </Typography>
              <Checkbox
                checked={item.invoiced}
                size="small"
                sx={styles.checkBox}
                onChange={() => handleChange(false, item.id, 'receivable', item.invoiced, 'invoiced')}
              />
            </Box>
          </Grid>
          <Grid item md={0.53} xs={2.4}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                Paid
              </Typography>
              <Checkbox
                checked={item.paid}
                size="small"
                sx={styles.checkBox}
                onChange={() => handleChange(false, item.id, 'receivable', item.paid, 'paid')}
              />
            </Box>
          </Grid>
          <Grid item md={0.7} xs={2.36}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                Lodged
              </Typography>
              <Checkbox checked={item.lodged} size="small" sx={styles.checkBox} />
            </Box>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item md={1.7} xs={12}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                Bookkeeper
              </Typography>
              <Box sx={styles.textCell}>
                <Typography variant="caption">{item.bookkeeperId.name}</Typography>
                {item.bookkeeperId.id !== '' && (
                  <Checkbox
                    checked={item.bookkept}
                    size="small"
                    sx={styles.taskCheckBox}
                    onChange={() => handleChange(true, item.id, item.bookkeeperId.id, item.bookkept, 'bookkept')}
                  />
                )}
              </Box>
            </Box>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item md={1.7} xs={9}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                Accountant
              </Typography>
              <Box sx={styles.textCell}>
                <Typography variant="caption">{item.accountantId.name}</Typography>
                {item.accountantId.id !== '' && (
                  <Checkbox
                    checked={item.statementPrepared}
                    size="small"
                    sx={styles.taskCheckBox}
                    onChange={() =>
                      handleChange(true, item.id, item.accountantId.id, item.statementPrepared, 'statementPrepared')
                    }
                  />
                )}
              </Box>
            </Box>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item md={0.61} xs={2.9}>
            <Box>
              <Typography variant="subtitle2" sx={styles.titleCell}>
                Done
              </Typography>
              <Checkbox
                checked={item.taskFinished}
                size="small"
                sx={styles.checkBox}
                onChange={() => handleChange(false, item.id, 'primary', item.taskFinished, 'taskFinished')}
              />
            </Box>
          </Grid>
        </Grid>
        <TaskRowCollapse open={open} item={item} memos={memos} />
      </Paper>
    </Grid>
  );
};

export default BASRow;
