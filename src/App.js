import { useState, useEffect, createContext } from 'react';
import { Container } from '@mui/material';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Clients from './pages/Clients';
import { auth } from './firebase';
import UserContext from './context/UserContext';
import CustomDialog from './components/CustomDialog';
import DialogContext from './context/DialogContext';

const App = () => {
  const [user, setUser] = useState({});
  const [dialog, setDialog] = useState({ open: false });

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    });
    return () => setUser({});
  }, []);

  function RequireAuth({ children }) {
    let location = useLocation();

    if (!user) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={user}>
        <DialogContext.Provider value={setDialog}>
          <Navbar user={user} />
          <CustomDialog {...dialog} />
          <Container maxWidth="lg">
            <Routes>
              <Route
                path="/"
                exact
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              />
              <Route
                path="/clients"
                exact
                element={
                  <RequireAuth>
                    <Clients />
                  </RequireAuth>
                }
              />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </Container>
        </DialogContext.Provider>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
