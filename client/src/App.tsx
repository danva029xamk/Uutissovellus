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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                <Typography variant="h4">Uutiset</Typography>
                {token ? (
                    <Button onClick={handleLogout} variant="contained" color="secondary" size="medium">
                        Kirjaudu ulos
                    </Button>
                ) : (
                    <Button onClick={() => navigate('/rekisteroidy')} variant="contained" color="primary" size="medium">
                        Rekisteröidy
                    </Button>
                )}
            </div>
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
