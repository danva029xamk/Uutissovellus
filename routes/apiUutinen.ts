import express from 'express';
import { PrismaClient } from "@prisma/client";
import { Virhe } from '../errors/virhekasittelija';

const prisma : PrismaClient = new PrismaClient();

const apiUutisetRouter : express.Router = express.Router();

apiUutisetRouter.use(express.json());

apiUutisetRouter.delete("/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (await prisma.uutinen.count({
        where : {
            id: Number(req.params.id)
        }
    })){
        try{

            await prisma.uutinen.delete({
                where : {
                    id : Number(req.params.id)
                }
            });

            res.json(await prisma.uutinen.findMany());

        } catch (e: any){
            next(new Virhe());
        }
    } else {
        next(new Virhe(404, "Uutista ei löydy"));
    }
});

apiUutisetRouter.put("/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (await prisma.uutinen.count({
        where : {
            id : Number(req.params.id)
        }
    })){
        if (req.body.otsikko.length > 0 && req.body.sisalto.length > 0){

            try {

                await prisma.uutinen.update({
                    where: {
                        id : Number(req.params.id)
                    },
                    data : {
                        otsikko: req.body.otsikko,
                        sisalto: req.body.sisalto
                    }
                });

                res.json(await prisma.uutinen.findMany());
            } catch (e: any){
                next(new Virhe());
            }
        } else {
            next(new Virhe(400, "Antamissasi tiedoissa on puutteita"));
        }
    } else {
        next(new Virhe(404, "Virheellinen id"));
    }
})

apiUutisetRouter.post("/", async (req : express.Request, res: express.Response, next: express.NextFunction) => {
    if(req.body.otsikko && req.body.sisalto){
        try {
            const pvmnyt = new Date().setHours(0,0,0,0);

            await prisma.uutinen.create({
                data : {
                    otsikko: req.body.otsikko,
                    sisalto: req.body.sisalto
                }
            });
               

            res.json(prisma.uutinen.findMany());

        } catch (e: any){
            next(new Virhe())
        }
    } else {
        next(new Virhe(400, "Täytä kaikki tiedot"));
    }
});



apiUutisetRouter.get("/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    try {
        if (await prisma.uutinen.count({
            where : {
                id : Number(req.params.id)
            }
        }) === 1) {
            res.json(await prisma.uutinen.findUnique({
                where: {
                    id : Number(req.params.id)
                }
            }))
        } else {
            next(new Virhe(400, "Virheellinen id"));
        }

    } catch (e: any) {
        next(new Virhe());
    }
});

apiUutisetRouter.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    try {
        res.json(await prisma.uutinen.findMany());
    } catch (e: any) {
        next(new Virhe());
    }
});

export default apiUutisetRouter;