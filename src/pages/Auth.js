import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { red } from '@mui/material/colors';
import { createUserWithEmailAndPassword, getAuth, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import Input from '../components/Input';
import { auth, db } from '../firebase';
import Selector from '../components/Selector';
import { LoadingButton } from '@mui/lab';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errMessage, setErrMessage] = useState('');
  const [position, setPosition] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);

  const navigation = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (!isSignIn) {
      if (formData?.password === formData?.confirmPassword) {
        createUserWithEmailAndPassword(auth, formData?.email, formData?.password)
          .then(() => {
            const auth = getAuth();
            updateProfile(auth.currentUser, { displayName: `${formData?.firstName} ${formData?.lastName}` });
          })
          .then(() => {
            const colRef = collection(db, 'staffs');
            addDoc(colRef, {
              firstName: formData?.firstName,
              lastName: formData?.lastName,
              email: formData?.email,
              uid: auth.currentUser.uid,
              position: position
            })
              .then(() => {
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
                setPosition('');
                navigation('/');
              })
              .catch(err => setErrMessage(err.message));
          })
          .catch(err => setErrMessage(err.message));
      } else {
        setErrMessage('Password is not match.');
      }
    }
    signInWithEmailAndPassword(auth, formData?.email, formData?.password)
      .then(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        navigation('/');
      })
      .catch(err => {
        setErrMessage(err.message);
      });
  };
  const handleChange = e => {
    setErrMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleShowPassword = () => setShowPassword(prevPassword => !prevPassword);

  const switchMode = () => {
    setIsSignIn(prevPassword => !prevPassword);
    setShowPassword(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{ mt: 16, textAlign: 'center', p: 2 }} elevation={3}>
        <Typography variant="h5" color="primary" mb={2}>
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </Typography>
        <form action="submit" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {!isSignIn && (
              <>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  label="First Name"
                  handleChange={handleChange}
                  grid={6}
                  autoFocus
                />
                <Input
                  name="lastName"
                  value={formData.lastName}
                  label="Last Name"
                  handleChange={handleChange}
                  grid={6}
                />
              </>
            )}
            <Input
              name="email"
              value={formData.email}
              label="Email Address"
              handleChange={handleChange}
              type="email"
              grid={isSignIn ? 12 : 7}
            />
            {!isSignIn && (
              <Selector
                grid={5}
                id="position"
                name="position"
                value={position}
                items={['Manager', 'Accountant', 'Bookkeeper', 'Receptionist', 'Financial']}
                handleChange={e => setPosition(e.target.value)}
              />
            )}
            <Input
              name="password"
              label="Password"
              value={formData.password}
              handleChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              handleShowPassword={handleShowPassword}
            />
            {!isSignIn && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                value={formData.confirmPassword}
                handleChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                handleShowPassword={handleShowPassword}
              />
            )}
            {/* <LoadingButton type="submit" size="small" fullWidth variant="contained" sx={{ ml: 2, mt: 2 }} loading loadingIndicator="Signing Up...">
              Sign Up
            </LoadingButton> */}
            <Button type="submit" size="small" fullWidth variant="contained" sx={{ ml: 2, mt: 2 }}>
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end" mt={2}>
              <Grid item>
                <Button onClick={switchMode} size="small">
                  {!isSignIn ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
            <Container>
              <Typography variant="subtitle2" color={red[500]} mt={2}>
                {errMessage}
              </Typography>
            </Container>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
