-- CreateTable
CREATE TABLE "Kommentti" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uutisId" INTEGER NOT NULL,
    "kayttajatunnus" TEXT NOT NULL,
    "kommentti" TEXT NOT NULL,
    "aikaleima" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Uutinen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "otsikko" TEXT NOT NULL,
    "sisalto" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Kayttaja" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajatunnus" TEXT NOT NULL,
    "salasana" TEXT NOT NULL
);
