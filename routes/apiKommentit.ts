import express from 'express';
import { PrismaClient } from "@prisma/client";
import { Virhe } from '../errors/virhekasittelija';

const prisma = new PrismaClient();
const apiKommentitRouter = express.Router();

apiKommentitRouter.use(express.json());

apiKommentitRouter.post('/:uutisId', async (req, res, next) => {
    try {
        const uutisId = parseInt(req.params.uutisId);
        const { kayttajatunnus, kommentti } = req.body;
        
        console.log(`POST /api/kommentit/:uutisId - uutisId: ${uutisId}, kayttajatunnus: ${kayttajatunnus}, kommentti: ${kommentti}`);
        
        const uusiKommentti = await prisma.kommentti.create({
            data: { uutisId, kayttajatunnus, kommentti, aikaleima: new Date().toISOString() }
        });

        console.log("Uusi kommentti luotu:", uusiKommentti);
        
        res.status(201).json(uusiKommentti);
    } catch (e) {
        next(new Virhe(500, "Kommentin tallennus epäonnistui"));
    }
});

apiKommentitRouter.get('/:uutisId', async (req, res, next) => {
    try {
        const uutisId = Number(req.params.uutisId);
        
        if (isNaN(uutisId)) {
            return next(new Virhe(400, "Virheellinen uutisId"));
        }

        const kommentit = await prisma.kommentti.findMany({
            where: {
                uutisId: uutisId
            },
            orderBy: {
                aikaleima: 'desc' // Tai 'asc' riippuen siitä, miten haluat järjestää
            }
        });

        res.json(kommentit);
    } catch (e) {
        next(new Virhe(500, "Kommenttien haku epäonnistui"));
    }
});

export default apiKommentitRouter;