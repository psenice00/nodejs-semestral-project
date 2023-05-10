# Semestrální projekt pro předmět 4IT573 - Základy Node.js
> Jakub Pšenička - letní semestr 2023 - VŠE FIS

Aplikace slouží jako zjednodušená verze REST api pro blogovou aplikaci. V této práci jsem si chtěl především osvojit práci z uživateli a jejich rolemi. Aplikace je založena na frameworku nestjs, proto jsou jednotlivé security komponenty a části kódu implementované právě v souladu s tímto frameworkem. 

## Popis
Aplikace pracuje s entitami `User`, `Blog` a `Comment` (Reflektují členění v Api) a využívá PostgreSQL databázi a TypeORM pro práci s daty. Aplikace má třívrstvou architekturu a používá Passport knihovnu pro správu uživatelů.

### Struktura aplikace
- Controllers: Ovladače zajišťují příjem HTTP požadavků a volání odpovídajících služeb.
- Services: Služby se starají o zpracování aplikační logiky a interakce s datovými zdroji.
- Entities: Entity reprezentují tabulky databáze a jsou použity pro mapování mezi objekty a databázovými záznamy.

### Api
Aplikace je dokumentována pomocí Swagger api, které je implementováno přímo v kódu. Je tedy možné využívat přímo interaktvině api.
Api je rozčleněno na 4 části: 
- Auth - autentizační část aplikace
- Users - oprace s uživateli
- Blog - oprace s entitou Blog
- Comment - oprace s entitou Comment

### Autentizace a autorizace
Aplikace používá Passport knihovnu pro správu uživatelů a jejich autentizaci. Většina API koncových bodů vyžaduje, aby byl uživatel přihlášený a případně autor. Ve swagger dokumentaci lze jednoduše token získaný po přihášení z `/auth/login` vložit v horní části a pohodně volat api s autentizačním headerem. V aplikaci jsou také 2 role: USER a ADMIN, proto je potřeba pro některé endpointy nebo operace potřeba mít práva admina.


## Installation
Nejprve nainstalujte potřebné packages: 

```bash
$ yarn install
```

Dále je nutné vytvořit `.env` soubor podle předlohy v `.env.example`. 


## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test
V aplikaci jsou včechny 3 základná druhy testování. Lze je jenoduše spustit pomocí skriptů níže.

```bash
# unit tests
$ yarn run test

# integration tests
$ yarn run test:integration

# e2e tests
$ yarn run test:e2e
```
