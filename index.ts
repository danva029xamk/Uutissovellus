import express from 'express';
import path from 'path';
import apiUutisetRouter from './routes/apiUutinen';
import virhekasittelija from './errors/virhekasittelija';
import jwt from 'jsonwebtoken';
import apiAuthRouter from './routes/apiAuth';
import apiKommentitRouter from './routes/apiKommentit';

const app : express.Application = express();
const portti : number = Number(process.env.PORT || 3106);


app.use(express.static(path.resolve(__dirname, "public")));

app.use('/api/kommentit', apiKommentitRouter);
app.use('/auth', apiAuthRouter);
app.use("/uutiset", apiUutisetRouter);

app.use(virhekasittelija);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Saapunut pyyntö:", req.method, req.url);
    if (!res.headersSent){
        res.status(404).json({ viesti : "Virheellinen reitti"});
    }
    
    next();
    
});

app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin: ${portti}`);
});