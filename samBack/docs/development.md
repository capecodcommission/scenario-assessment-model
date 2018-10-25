# Setup and development

- [First-time setup](#first-time-setup)
- [Installation](#installation)
- [Spinning Up](#spinning-up)
  - [Development](#development)
  - [Production](#production)

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

## Local Instantiation

```bash
# Launch server
node server.js
```

## Production Instantiation on Apache

```bash
# Start shell session
screen

# Launch server using forever module
# https://github.com/foreverjs/forever
forever start server.js
```

### Development

Modify DEV environment variables with relevant credentials

```bash
DEVHOST="localhost"
DEVPORT="5432"
DEVDB="SAM_GEODB"
DEVUSER="mario"
DEVPASSWORD="password"
```

### Production

Modify PROD environment variables with relevant credentials

```bash
PRODHOST="prodhost"
PRODPORT="####"
PRODDB="DBName"
PRODUSER="produser"
PRODPASSWORD="prodpassword"
```