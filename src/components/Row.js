import {
  IconButton,
  Link,
  TableCell,
  TableRow,
  Box,
  Collapse,
  Container,
  InputAdornment,
  Grid,
  TextField,
  Chip,
  Typography,
  Tooltip
} from '@mui/material';
import { doc, writeBatch } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import DialogContext from '../context/DialogContext';
import UserContext from '../context/UserContext';
import { addDocu, deleteDocu } from '../controllers/oneLevel';
import snapShot from '../controllers/snapshotListener';
import { db } from '../firebase';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { copyText } from '../controllers/scripts';
import rowItemHoverStyle from './styles/rowItemHoverStyle';

const Row = ({ row, setIsShow, setClient, setTaskShow }) => {
  const [open, setOpen] = useState(false);
  const [memo, setMemo] = useState('');
  const [memos, setMemos] = useState([]);
  const user = useContext(UserContext);
  const setDialog = useContext(DialogContext);

  useEffect(() => {
    snapShot('memos', setMemos, 'createdAt', true);
    console.log(user);
    return () => setMemos([]);
  }, []);
  const deleteMemos = async id => {
    const batch = writeBatch(db);
    const deleteMemos = memos;
    deleteMemos.forEach(memo => {
      if (memo.clientId === id) {
        const docRef = doc(db, 'memos', memo.id);
        batch.delete(docRef);
      }
    });
    await batch.commit();
  };
  const editClient = client => {
    setIsShow(true);
    setClient(client);
  };
  const addTask = client => {
    setTaskShow(true);
    setClient(client);
  };
  const deleteClient = async id => {
    await deleteMemos(id);
    deleteDocu('clients', id, console.log('success'));
    setDialog({ open: false });
  };
  const openDialog = id => {
    setDialog({
      open: true,
      handleAgree: () => deleteClient(id),
      handleDisagree: () => setDialog({ open: false }),
      title: 'Delete this client?',
      text: 'Press "Agree" button to delete this client, otherwise, click "Disagree" button.'
    });
  };
  const handleSubmit = (e, id) => {
    e.preventDefault();
    addDocu('memos', { memo, clientId: id, personAdded: user?.displayName }, setMemo(''));
  };
  const handleMemoDelete = id => {
    deleteDocu('memos', id);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Tooltip title="Copy" placement="top-start">
            <Box sx={{ ':hover': { cursor: 'pointer' } }} onClick={() => copyText(row.businessName)}>
              {row.businessName}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell align="right">
          <Link
            underline="none"
            href={`https://abr.business.gov.au/ABN/View?abn=${row.abn}`}
            target="_blank"
            rel="noreferrer"
          >
            {row.abn}
          </Link>
        </TableCell>
        <TableCell align="right">
          <Tooltip title="Copy" placement="top">
            <Box sx={{ ':hover': { cursor: 'pointer' } }} onClick={() => copyText(row.contactPerson)}>
              {row.contactPerson}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell align="right">
          <Link underline="none" href={`mailto:${row.email}`}>
            {row.email}
          </Link>
        </TableCell>
        <TableCell align="right">
          <Link underline="none" href={`tel:${row.phoneNumber}`}>
            {row.phoneNumber}
          </Link>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex' }}>
            <IconButton onClick={() => editClient(row)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => openDialog(row.id)}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => addTask(row)}>
              <AddTaskIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Container sx={{ m: 1 }}>
              <Grid container>
                <Grid item xs={12} md={6} sx={{ pt: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" color="primary">
                      ACN:
                    </Typography>
                    <Tooltip title="Copy" placement="top">
                      <Typography variant="body" sx={rowItemHoverStyle} onClick={() => copyText(row.acn)}>
                        {row.acn}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="primary">
                      TFN:
                    </Typography>
                    <Tooltip title="Copy" placement="top">
                      <Typography variant="body" sx={rowItemHoverStyle} onClick={() => copyText(row.tfn)}>
                        {row.tfn}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="primary">
                      Address:
                    </Typography>
                    <Tooltip title="Copy" placement="top">
                      <Typography variant="body" sx={rowItemHoverStyle} onClick={() => copyText(row.address)}>
                        {row.address}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <form action="submit" onSubmit={e => handleSubmit(e, row.id)}>
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
                    .filter(memo => memo.clientId === row.id)
                    .map(memo => (
                      <Box sx={{ mt: 1 }} key={memo.id}>
                        <Chip label={memo.memo} onDelete={() => handleMemoDelete(memo.id)} sx={{ p: -2 }} />
                      </Box>
                    ))}
                </Grid>
              </Grid>
            </Container>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default Row;
