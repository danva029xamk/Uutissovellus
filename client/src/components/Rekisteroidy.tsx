import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
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
        <div>
            <TextField label="Käyttäjätunnus" value={kayttajatunnus} onChange={(e) => setKayttajatunnus(e.target.value)} />
            <TextField label="Salasana" type="password" value={salasana} onChange={(e) => setSalasana(e.target.value)} />
            <Button onClick={rekisteroi}>Rekisteröidy</Button>
        </div>
    );
};

export default Rekisterointi;