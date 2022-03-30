import { useState } from 'react';
import { Container } from '@mui/material';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Home from './pages/Home';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './firebase';

const App = () => {
  const [user, setUser] = useState({});
  onAuthStateChanged(auth, user => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    console.log(user);
  });

  function RequireAuth({ children }) {
    let location = useLocation();

    if (!user) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} />
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
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
