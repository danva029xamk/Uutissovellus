import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardHeader, Button, List, ListItem, TextField } from '@mui/material';
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
    token : string;
}

const Uutiset: React.FC<UutisetProps> = ({token}) => {
    const [uutiset, setUutiset] = useState<Uutinen[]>([]);
    const [kommentit, setKommentit] = useState<Kommentti[]>([]);
    const [uusiKommentti, setUusiKommentti] = useState('');
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
        // Oletetaan, että ensimmäinen uutinen on aina olemassa
        const ensimmainenUutinenId = uutiset[0]?.id;
        if (ensimmainenUutinenId) {
            const haeKommentit = async () => {
                const vastaus = await fetch(`/api/kommentit/${ensimmainenUutinenId}`);
                if (vastaus.ok) {
                    const kommentitData = await vastaus.json();
                    setKommentit(kommentitData);
                }
            };
            haeKommentit();
        }
    }, [uutiset]);

    const lahetaKommentti = async () => {

        const kayttajatunnus = localStorage.getItem("kayttajatunnus");
        const uutisId = uutiset[0].id;

        if (!uusiKommentti.trim()) {
            alert('Kommentti ei voi olla tyhjä');
            return;
        }

        try {
            const vastaus = await fetch(`/api/kommentit/${uutiset[0].id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    kayttajatunnus,  
                    kommentti: uusiKommentti,
                    aikaleima: new Date().toLocaleString(),
                    uutisId
                    })
            });

            if (vastaus.ok) {
                const lisattyKommentti = await vastaus.json();
                setKommentit([...kommentit, lisattyKommentti]);
                setUusiKommentti('');
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

    const ensimmainenUutinen = uutiset[0];

    return (
        <Container>
            <Card>
                <CardHeader title={ensimmainenUutinen.otsikko} />
                <CardContent>
                    <Typography variant="body1">{ensimmainenUutinen.sisalto}</Typography>
                    <List>
                        {kommentit.map(k => (
                            <ListItem key={k.id}>
                                <Typography variant="body2">
                                    {k.kommentti} - {k.kayttajatunnus}, 
                                    {new Date(k.aikaleima).toLocaleDateString()} 
                                    {new Date(k.aikaleima).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, 
                                    Uutisen id: {k.uutisId}</Typography>
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
                                onChange={(e) => setUusiKommentti(e.target.value)}
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
        </Container>
    );
};

export default Uutiset;