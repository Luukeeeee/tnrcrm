import {
  Container,
  IconButton,
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

import ClientsModal from '../components/ClientsModal';
import snapShot from '../controllers/snapshotListener';
import Input from '../components/Input';
import style from '../components/styles/clientTableCellStyles';
import Row from '../components/Row';
import TasksModal from '../components/TasksModal';

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`clients-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [taskShow, setTaskShow] = useState(false);
  const [sortedClients, setSortedClients] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [client, setClient] = useState(null);

  const clientTypes = ['All', 'Company', 'Individual', 'Sole Trader', 'Partnership', 'Trust', 'SMSF'];

  useEffect(() => {
    snapShot('clients', setClients, 'businessName');
    return () => setClients([]);
  }, []);

  useEffect(() => {
    setSortedClients(clients);
  }, [clients]);

  const handleChange = (event, newValue) => setTabValue(newValue);

  const handleFilter = e => {
    let newSortedClients = clients.filter(client =>
      client.businessName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSortedClients(newSortedClients);
  };

  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Grid container>
          <Input
            gridxs={8}
            grid={4}
            name="search"
            label="Search Client"
            handleChange={handleFilter}
            autoFocus
            required={false}
            size="small"
          />
          <Grid item xs={2}></Grid>
          <Grid item xs={2} sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton onClick={() => setIsShow(true)}>
              <AddBusinessIcon color="secondary" />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          aria-label="clients group tabs"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          value={tabValue}
          onChange={handleChange}
        >
          {clientTypes.map((type, i) => (
            <Tab
              label={`${type}(${
                type === 'All'
                  ? sortedClients.length
                  : sortedClients.filter(client => client.clientType === type).length
              })`}
              id={i}
              aria-controls={i}
              key={i}
            />
          ))}
        </Tabs>
        <IconButton
          sx={{ mt: -5, float: 'right', display: { xs: 'none', md: 'block' } }}
          onClick={() => setIsShow(true)}
        >
          <AddBusinessIcon color="secondary" />
        </IconButton>
      </Box>
      {clientTypes.map((type, i) =>
        type === 'All' ? (
          <TabPanel value={tabValue} index={i} key={i}>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 600, width: { xs: '90vw', md: 'auto' }, ml: { xs: -5.5, md: 0 } }}
            >
              <Table stickyHeader aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={style} />
                    <TableCell sx={style}>
                      <Typography>Client Name</Typography>
                    </TableCell>
                    <TableCell sx={style} align="right">
                      <Typography>ABN</Typography>
                    </TableCell>
                    <TableCell sx={style} align="right">
                      <Typography>Contact Person</Typography>
                    </TableCell>
                    <TableCell sx={style} align="right">
                      <Typography>Email</Typography>
                    </TableCell>
                    <TableCell sx={style} align="right">
                      <Typography>Phone Number</Typography>
                    </TableCell>
                    <TableCell sx={style} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedClients
                    .sort((a, b) => (a.businessName < b.businessName ? -1 : 1))
                    .map(row => (
                      <Row key={row.id} row={row} setIsShow={setIsShow} setClient={setClient} setTaskShow={setTaskShow} />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        ) : (
          <TabPanel value={tabValue} index={i} key={i}>
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={style} />
                    <TableCell sx={style}>
                      <Typography>Client Name</Typography>
                    </TableCell>
                    <TableCell sx={style} align="right">
                      <Typography>ABN</Typography>
                    </TableCell>
                    <TableCell sx={style} align="right">
                      <Typography>Contact Person</Typography>
                    </TableCell>
                    <TableCell sx={style} align="right">
                      <Typography>Email</Typography>
                    </TableCell>
                    <TableCell sx={style} align="right">
                      <Typography>Phone Number</Typography>
                    </TableCell>
                    <TableCell sx={style} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedClients
                    .filter(client => client.clientType === type)
                    .sort((a, b) => (a.businessName < b.businessName ? -1 : 1))
                    .map(row => (
                      <Row
                        key={row.id}
                        row={row}
                        setIsShow={setIsShow}
                        setClient={setClient}
                        setTaskShow={setTaskShow}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        )
      )}
      <ClientsModal isShow={isShow} setIsShow={setIsShow} client={client} setClient={setClient} />
      <TasksModal taskShow={taskShow} setTaskShow={setTaskShow} client={client} setClient={setClient} />
    </Container>
  );
};

export default Clients;
