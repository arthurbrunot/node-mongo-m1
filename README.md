# API NODE JS EXPRESS MONGODB
Cette application a pour but de fournir une api sécurisée destinée à une entreprise de piscinistes.

Les fonctionnalités sont les suivantes :

- CRUD sur les clients
- CRUD sur les interventions chez un client

Après avoir ajouté un client il est possible de renseigner des interventions sur ce dernier.

## Lancer le projet
Exécutez les commandes suivantes :

- `cp .env.example .env` et remplir les informations nécessaires ( pré-remplies pour le démo )
- `npm install`
- `npm run dev`

## PostMan

Afin de faciliter l'utilisation de l'api, une collection postman est disponible avec l'ensemble des requêtes disponibles.

Il suffit de l'importer dans postman, le fichier se trouve dans `./postman-collection`

Pour que le Bearer s'applique automatiquement, il faut s'authentifier puis aller dans le menu d'édition de la collection et rentrer le Bearer obtenu dans l'input Bearer (le Bearer est obtenu depuis la requête Login)

## Structure du projet
Afin d'améliorer la compréhension du projet, celui-ci respecte la structure RCS ( Route Controller Service )

    ├───models
    │   ├───user.model.js
    ├───routes
    │   ├───user.route.js
    ├───services
    │   ├───user.service.js
    ├───controllers
    │   ├───user.controller.js

## Authentification

Afin d'utiliser l'application il est nécéssaire de s'authentifier.

L'authentification est assurée par le package `express-jwt`
Le chiffrage est assuré par `bcrypt`

Les requêtes register et login sont disponibles dans la connection Postman.

## Réponses API personnalisées
A des fins de débuggage et également d'utilisation en front dans le futur, les réponses api sont personnalisées dans le fichier `./helpers/customApiResponses.js`

## ESLint
ESlint est installé pour rendre le code plus propre. Pour fix le code déjà présent, lancez la commande `npm lint`

## Swagger
Swagger est configuré pour l'api à l'adresse `http://localhost:3000/api-docs/`

## Technologies
Les technologies utilisées sont les suivantes :

- Node
- Express
- Mongoose
- express-jwt
- bcrypt
- eslint
- express-validator
- jsonwebtoken
- dotenv
- nodemon
