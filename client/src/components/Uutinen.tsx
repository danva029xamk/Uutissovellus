import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardHeader, Button, List, ListItem, Stack, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Uutinen {
    id: number;
    otsikko: string;
    sisalto: string;
}

interface Kommentti {
    id: number;
    uutisId: number;
    kayttajatunnus: string;
    kommentti: string;
    aikaleima: string;
}

interface UutisetProps {
    token: string;
}

const Uutiset: React.FC<UutisetProps> = ({ token }) => {
    const [uutiset, setUutiset] = useState<Uutinen[]>([]);
    const [kommentit, setKommentit] = useState<{ [key: number]: Kommentti[] }>({});
    const [uusiKommentti, setUusiKommentti] = useState('');
    const [aktiivinenUutisId, setAktiivinenUutisId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const haeUutiset = async () => {
            try {
                const vastaus = await fetch(`/uutiset`);
                if (!vastaus.ok) throw new Error('Virhe uutisten haussa');
                const uutisetData = await vastaus.json();
                setUutiset(uutisetData);
            } catch (error) {
                console.error('Virhe uutisten haussa:', error);
            }
        };

        haeUutiset();
    }, []);

    useEffect(() => {
        uutiset.forEach(uutinen => {
            fetch(`/api/kommentit/${uutinen.id}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Virhe kommenttien haussa');
                })
                .then(data => {
                    setKommentit(prevKommentit => ({
                        ...prevKommentit,
                        [uutinen.id]: data
                    }));
                })
                .catch(error => {
                    console.error('Virhe kommenttien haussa:', error);
                });
        });
    }, [uutiset]);

    const lahetaKommentti = async () => {
        const kayttajatunnus = localStorage.getItem("kayttajatunnus");

        if (!aktiivinenUutisId || !uusiKommentti.trim()) {
            alert('Kommentti ei voi olla tyhjä');
            return;
        }

        try {
            const vastaus = await fetch(`/api/kommentit/${aktiivinenUutisId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    kayttajatunnus,  
                    kommentti: uusiKommentti,
                    aikaleima: new Date().toISOString(),
                    uutisId: aktiivinenUutisId
                })
            });

            if (vastaus.ok) {
                const lisattyKommentti = await vastaus.json();
                setKommentit(prevKommentit => ({
                    ...prevKommentit,
                    [aktiivinenUutisId]: [...prevKommentit[aktiivinenUutisId] || [], lisattyKommentti]
                }));
                setUusiKommentti('');
                setAktiivinenUutisId(null);
            } else {
                alert('Kommentin lähettäminen epäonnistui');
            }
        } catch (error) {
            console.error('Virhe kommentin lähettämisessä:', error);
        }
    };

    if (uutiset.length === 0) {
        return <Typography variant="body1">Ei uutisia saatavilla.</Typography>;
    }

    return (
            <Container>
                {uutiset.map(uutinen => (
                    <Card key={uutinen.id} sx={{ marginBottom: 2, borderRadius: 2, elevation: 4 }}>
                        <CardHeader 
                            title={uutinen.otsikko}
                            titleTypographyProps={{ variant: "h5" }}
                            sx={{ backgroundColor: '#f5f5f5' }} 
                        />
                        <CardContent>
                            <Typography variant="body1" gutterBottom>{uutinen.sisalto}</Typography>
                            <List>
                                {kommentit[uutinen.id]?.map(k => (
                                    <ListItem key={k.id} sx={{ border: 1, borderColor: 'grey.300', borderRadius: 2, mb: 1, backgroundColor: '#fafafa' }}>
                                        <Stack spacing={1} sx={{ width: '100%' }}>
                                            <Typography variant="body2" component="p">
                                                {k.kommentti}
                                            </Typography>
        
                                            <Grid container justifyContent="space-between">
                                                <Grid item>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {k.kayttajatunnus}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {new Date(k.aikaleima).toLocaleDateString()} {new Date(k.aikaleima).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </ListItem>
                                ))}
                            </List>
                            {token && (
                                <>
                                    <TextField
                                        label="Kommentti"
                                        multiline
                                        rows={4}
                                        value={uusiKommentti}
                                        onChange={(e) => {
                                            setUusiKommentti(e.target.value);
                                            setAktiivinenUutisId(uutinen.id);
                                        }}
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={lahetaKommentti}
                                    >
                                        Lähetä kommentti
                                    </Button>
                                </>
                            )}
                        {!token && (
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => navigate('/auth/login')}
                            >
                                Kirjaudu sisään kommentoidaksesi
                            </Button>
                        )}
                        </CardContent>
                    </Card>
                ))}
            </Container>
    );
}

export default Uutiset;
