# Instantiation

- [First-time setup](#first-time-setup)
- [Installation](#installation)
- [Development](#local)
- [Production](#production-apache)

## First-time setup

Make sure you have the following installed:

- [Node](https://nodejs.org/en/) (at least the latest LTS)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/) (at least 1.0)

Then update the following files to suit your application:

- `.env` (Raw database connection information. See [Example](envExample.md))
- `config.js` (Database connection structure using environment variables)

## Installation

```bash
# Install dependencies from package.json
yarn 
```

## Local

Modify DEV environment variables with relevant credentials

```bash
DEVHOST="localhost"
DEVPORT="5432"
DEVDB="SAM_GEODB"
DEVUSER="mario"
DEVPASSWORD="password"
```

Ensure Sequelize is using development configuration env variables in `classes/db/db.js`

```bash
const sequelize = new Sequelize(config.development)
```

```bash
# Launch server
node server.js
```

## Production Apache

Modify PROD environment variables with relevant credentials

```bash
PRODHOST="prodhost"
PRODPORT="####"
PRODDB="DBName"
PRODUSER="produser"
PRODPASSWORD="prodpassword"
```

Point Sequelize at production configuration env variables in `classes/db/db.js`

```bash
const sequelize = new Sequelize(config.production)
```

SSH into Apache server, cd to relevant directory

```bash
# Install forever from npm if you haven't yet
npm i -g forever

# Start new terminal instance
screen

# Launch server with forever module
# https://github.com/foreverjs/forever
forever start server.js
```