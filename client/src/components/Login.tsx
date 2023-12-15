import React, { Dispatch, SetStateAction, useState } from 'react';
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Props {
    setToken: Dispatch<SetStateAction<string>>;
}


const Login: React.FC<Props> = (props : Props) : React.ReactElement => {
    const [kayttajatunnus, setKayttajatunnus] = useState('');
    const [salasana, setSalasana] = useState('');
    const navigate = useNavigate();

    const kirjaudu = async (e: React.FormEvent<HTMLFormElement>) : Promise<void> => {
        e.preventDefault();

        if (kayttajatunnus && salasana) {
            try {
                const yhteys = await fetch("/auth/login", {
                    method: "POST",
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        kayttajatunnus,
                        salasana
                    })
                });

                if (yhteys.status === 200) {
                    const { token } = await yhteys.json();

                    props.setToken(token);

                    localStorage.setItem("token", token);
                    localStorage.setItem("kayttajatunnus", kayttajatunnus);
                    navigate("/");
                } else {
                    console.error('Kirjautuminen epäonnistui');
                }
            } catch (error) {
                console.error('Yhteysvirhe:', error);
            }
        } else {
            alert("Käyttäjätunnus ja salasana ovat pakollisia");
        }
    };

    return (
        <Backdrop open={true}>
            <Paper sx={{padding: 2}}>
                <Box
                    component='form'
                    onSubmit={kirjaudu}
                    sx={{ width: 300, backgroundColor: "#fff", padding: 2 }}
                >
                    <Stack spacing={2}>
                        <Typography variant="h6">Kirjaudu sisään</Typography>
                        <TextField
                            label='Käyttäjätunnus'
                            variant='outlined'
                            value={kayttajatunnus}
                            onChange={(e) => setKayttajatunnus(e.target.value)}
                        />
                        <TextField
                            label='Salasana'
                            type='password'
                            variant='outlined'
                            value={salasana}
                            onChange={(e) => setSalasana(e.target.value)}
                        />
                        <Button type='submit' variant="contained" size="large">Kirjaudu</Button>
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>Peruuta</Button>
                    </Stack>
                </Box>
            </Paper>
        </Backdrop>
    );
};

export default Login;