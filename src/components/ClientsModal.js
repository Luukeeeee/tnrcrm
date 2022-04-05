import { Box, Modal, Typography, Grid, Button } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { addDocu, updateDocu } from '../controllers/oneLevel';
import { db } from '../firebase';
import Input from './Input';
import Selector from './Selector';

import style from './styles/modalStyles';

const ClientsModal = ({ isShow, setIsShow, client, setClient }) => {
  const initialClientInfo = {
    clientType: 'Company',
    businessName: '',
    abn: '',
    acn: '',
    tfn: '',
    contactPerson: '',
    address: '',
    email: '',
    phoneNumber: ''
  };
  const [clientInfo, setClientInfo] = useState(initialClientInfo);

  useEffect(() => {
    if (client) {
      setClientInfo(client);
    }
    return () => setClientInfo(initialClientInfo);
  }, [client]);

  const handleClose = () => {
    setIsShow(false);
    setClient(null);
  };

  const handleChange = e => {
    setClientInfo({ ...clientInfo, [e.target.name]: e.target.value });
  };

  const thenFunc = () => {
    setClientInfo(initialClientInfo);
    handleClose();
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (client) {
      updateDocu('clients', clientInfo.id, clientInfo, clientInfo.id, thenFunc());
    } else {
      addDocu('clients', clientInfo, thenFunc());
    }
  };
  return (
    <Modal open={isShow} onClose={handleClose}>
      <Box sx={style}>
        <Typography>{client ? 'Edit Client' : 'Add Client'}</Typography>
        <form action="submit" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Selector
              grid={4}
              id="clientType"
              name="clientType"
              label="Client Type"
              value={clientInfo?.clientType}
              items={['Company', 'Individual', 'Sole Trader', 'Partnership', 'Trust', 'SMSF']}
              handleChange={handleChange}
            />
            <Input
              grid={8}
              name="businessName"
              value={clientInfo?.businessName}
              handleChange={handleChange}
              label={clientInfo?.clientType === 'Individual' ? 'Client Name' : 'Business Name'}
            />
            {clientInfo.clientType === 'Individual' ? null : (
              <>
                <Input
                  gridxs={6}
                  grid={4}
                  name="abn"
                  label="ABN"
                  type="number"
                  value={clientInfo?.abn}
                  handleChange={handleChange}
                />
                <Input
                  gridxs={6}
                  grid={4}
                  name="acn"
                  label="ACN"
                  type="number"
                  value={clientInfo?.acn}
                  handleChange={handleChange}
                  required={false}
                />
              </>
            )}
            <Input
              gridxs={6}
              grid={4}
              name="tfn"
              label="TFN"
              type="number"
              value={clientInfo?.tfn}
              handleChange={handleChange}
              required={false}
            />
            <Input
              gridxs={6}
              grid={4}
              name="contactPerson"
              label="Contact Person"
              value={clientInfo?.contactPerson}
              handleChange={handleChange}
              required={false}
            />
            <Input
              grid={8}
              name="address"
              label="Address"
              value={clientInfo?.address}
              handleChange={handleChange}
              type="address"
              required={false}
            />
            <Input
              gridxs={7}
              grid={6}
              name="email"
              label="Email"
              value={clientInfo?.email}
              handleChange={handleChange}
              type="email"
            />
            <Input
              gridxs={5}
              grid={6}
              name="phoneNumber"
              label="Phone number"
              type="phone"
              value={clientInfo?.phoneNumber}
              handleChange={handleChange}
            />
          </Grid>
          <Button type="submit">Submit</Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ClientsModal;
