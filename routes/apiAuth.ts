import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/virhekasittelija';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.use(express.json());

apiAuthRouter.post('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) : Promise<void> => {

    try {

        const kayttaja = await prisma.kayttaja.findFirst({
            where: {
                kayttajatunnus : req.body.kayttajatunnus
            }
        })

        if (req.body.kayttajatunnus === kayttaja?.kayttajatunnus){

            let hash = crypto.createHash("SHA512").update(req.body.salasana).digest("hex");

            if(hash === kayttaja?.salasana){

                let token = jwt.sign({}, String(process.env.ACCESS_TOKEN_KEY));

                res.json({ token : token })

            } else {
                next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
            }
        } else {
            next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
        }

    } catch (e: any){
        next(new Virhe());
    }

});

apiAuthRouter.post('/rekisteroidy', async (req, res, next) => {
    try {
        const { kayttajatunnus, salasana } = req.body;

        // Tarkista, onko käyttäjätunnus jo olemassa
        const kayttajaOlemassa = await prisma.kayttaja.findFirst({
            where: {
                kayttajatunnus: kayttajatunnus
            }
        });

        if (kayttajaOlemassa) {
            return next(new Virhe(400, "Käyttäjätunnus on jo käytössä"));
        }

        // Hashaa salasana
        const salasanaHash = crypto.createHash("SHA512").update(salasana).digest("hex");

        // Luo uusi käyttäjä
        const uusiKayttaja = await prisma.kayttaja.create({
            data: {
                kayttajatunnus: kayttajatunnus,
                salasana: salasanaHash
            }
        });

        res.status(201).json({ viesti: "Rekisteröinti onnistui", kayttaja: uusiKayttaja });
    } catch (e) {
        next(new Virhe(500, "Rekisteröinnissä tapahtui virhe"));
    }
});

export default apiAuthRouter;