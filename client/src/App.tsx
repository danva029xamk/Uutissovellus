import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Uutinen from './components/Uutinen';
import Login from './components/Login';
import Rekisterointi from './components/Rekisteroidy';


const App : React.FC = () : React.ReactElement => {

  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/');
  };

  return (
    <Container>
      <Typography variant="h5">Uutiset</Typography>
      {token ? (
        <Button onClick={handleLogout}>Kirjaudu ulos</Button>
      ) : (
        <>
          <Button onClick={() => navigate('/rekisteroidy')} style={{ marginLeft: '10px' }}>Rekisteröidy</Button>
        </>
      )}
      <Routes>
        <Route path='/' element={<Navigate replace to="/uutiset" />} />
        <Route path='/uutiset' element={<Uutinen token={token} />} />
        <Route path='/auth/login' element={<Login setToken={setToken} />} />
        <Route path='/rekisteroidy' element={<Rekisterointi />} />
      </Routes>
    </Container>
  );
};

export default App;
