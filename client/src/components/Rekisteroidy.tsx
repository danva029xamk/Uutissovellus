import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Rekisterointi = () => {
    const [kayttajatunnus, setKayttajatunnus] = useState('');
    const [salasana, setSalasana] = useState('');
    const navigate = useNavigate();

    const rekisteroi = async () => {
        try {
            const vastaus = await fetch('/auth/rekisteroidy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ kayttajatunnus, salasana })
            });

            if (vastaus.ok) {
                alert('Rekisteröinti onnistui');
                navigate('/'); 
            } else {
                alert('Rekisteröinti epäonnistui');
            }
        } catch (error) {
            console.error('Virhe rekisteröinnissä:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h6" style={{ marginTop: '20px' }}>Rekisteröidy</Typography>
            <div style={{ margin: '20px 0' }}>
                <TextField 
                    label="Käyttäjätunnus" 
                    value={kayttajatunnus} 
                    onChange={(e) => setKayttajatunnus(e.target.value)} 
                    fullWidth 
                    margin="normal" 
                />
                <TextField 
                    label="Salasana" 
                    type="password" 
                    value={salasana} 
                    onChange={(e) => setSalasana(e.target.value)} 
                    fullWidth 
                    margin="normal" 
                />
                <Button onClick={rekisteroi} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                    Rekisteröidy
                </Button>
            </div>
        </Container>
    );
};

export default Rekisterointi;