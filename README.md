# Lensqr

## Overview
Lensqr is a Node.js and TypeScript wallet service backend built with Express, Knex, MySQL, and JWT-style mock authentication for local development. The project exposes wallet operations such as account creation, funding, transfer, and withdrawal through a REST API.

## Architecture
   src|_
      controllers
      database|_
              migration
      middleware
      routes
      services
      tests
      types

### Core modules
- `src/server.ts` – Application bootstrap and Express server setup.
- `src/routes/wallet.routes.ts` – Route definitions for wallet endpoints.
- `src/controllers/wallet.controller.ts` – HTTP request handling and response shaping.
- `src/services/wallet.service.ts` – Core business logic for wallet operations.
- `src/services/adjutor.service.ts` – Integration point for blacklist / fraud checks.
- `src/database/database.ts` – Knex database connection setup.
- `src/database/migrations/` – Schema migrations for wallets and transactions.

### Request flow
1. An HTTP request hits the Express route.
2. The controller parses input and delegates to the wallet service.
3. The service performs validation and uses Knex transactions for consistent database updates.
4. Results are returned to the client as JSON responses.

### User Authentication
For user authentication since the authentication use is a faux type (dummy).
You just need to pass the user ID as the token e.g

```
headers: {
    Authorizaton: Bearer 1
}
```

## Features
- Create wallet accounts.
- Fund wallet balances.
- Transfer funds between users.
- Withdraw funds from a wallet.
- Use database transactions to keep wallet operations atomic.

## Database
The project uses MySQL via Knex.

### ERD

You can view the model of this database in `dbdesigner` using this link: https://app.dbdesigner.net/schema-images//137691.png.

And below is the current entity relationship design for the schema:

```
erDiagram
    USERS {
        integer id PK
        string email UNIQUE
        string password
        string name
        datetime created_at
        datetime updated_at
    }

    WALLETS {
        integer id PK
        integer userId UNIQUE
        decimal balance
        string currency
        datetime created_at
        datetime updated_at
    }

    TRANSACTIONS {
        integer id PK
        integer walletId
        string type
        decimal amount
        integer referenceWalletId NULL
        string reference UNIQUE
        datetime created_at
        datetime updated_at
    }

    USERS ||--|| WALLETS : owns
    WALLETS ||--o{ TRANSACTIONS : records }
    WALLETS ||--o{ TRANSACTIONS : "reference wallet"}
```

### Migration commands
- `npm run db:migrate`
- `npm run db:rollback`
- `npm run migration <migration-name>`

## Testing
The project includes unit tests for wallet service logic using Jest.

### Run tests
```bash
npm test
```

## Development
### Start the app
```bash
npm run dev
```

### Build the app
```bash
npm run build
```

## Notes
- The current project uses a local mock auth middleware in the route layer for development purposes.
- Environment variables such as database credentials and adjutor service settings should be configured in the application environment.
