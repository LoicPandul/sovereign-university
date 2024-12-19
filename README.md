# Plan B Network

This is the repository for the PlanB Network website. The goal of this project is to create a free, open-source, and community-driven platform to learn about Bitcoin.

The repository holding the data for this project is [here](https://github.com/PlanB-Network/bitcoin-educational-content).

We are looking for contributors! If you want to help or learn more about the project, please reach out to us on [Twitter](https://twitter.com/planb_network) or [Discord](https://discord.com/invite/CHvZAhJCBh).

## Development - Run the project locally

### Option 1: with docker (preferred)

We use [Turbo](https://turbo.build/) to manage the monorepo and Docker to run the development environment.

Follow the next steps to run the project locally, on a linux machine.

#### Clone the repo

Do it.

#### Setup your environment variables

Duplicate the [.env.example](.env.example) file and rename the duplicate `.env`.

#### Run the containers

To start the development environment, run :

1. `pnpm install`
2. `docker compose up --build -V`

This will start all the necessary containers.

#### Set up your database schema

On the first run, you will need to run the DB migrations.

To do so, run the migration script : `pnpm run dev:db:migrate`

Once the containers are up and running, you can access the front at `http://localhost:8181`. The app will automatically reload if you change any of the source files.

#### Import data from the data repository

In order to sync the database with the data from the data repository, you can make a request to the API with `curl -X POST http://localhost:3000/api/github/sync`. This will import all the data from the data repository into the database.

#### Sync issue

When running the sync locally, there is currently and access right issue with the cdn and sync volumes. To fix it, update the access rights with the following command :
`docker exec --user=root bitcoin-learning-management-system-api-1 chmod 777 /tmp/{sync,cdn}`

### Option 2 - Without docker

You may want to run the project locally to test your changes. Here is how to do it.

#### Pre-requisites:

- Node.js
- PostgreSQL
- Redis

#### Install global dependencies

```bash
npm i -g pnpm dotenv-cli
```

##### MacOS only

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman vips
```

#### Setup your local database

Login to your local PostgreSQL instance (`psql -U postgres`) and run the following commands:

```sql
CREATE USER plan_b WITH PASSWORD 'plan_b';
CREATE DATABASE plan_b WITH OWNER plan_b;
```

Update your `.env` file accordingly.

#### Sync the database

```bash
pnpm run dev:db:migrate:local
```

#### Start a local CDN

```bash
docker run -d --restart=always -p 8080:80 \
  -v /tmp/cdn:/var/www/cdn:ro \
  -v ./docker/cdn/nginx.conf:/etc/nginx/nginx.conf:ro \
  --name cdn-server \
  nginx:alpine
```

## Development - Manage the database

### Update the schema

The central point for the database schema is this file : [Schema](/packages/database/drizzle/schema.ts).

For any update to it, you first have to update the schema.ts file.

Once updated, to reflect it in your database, run the following commands :

1. `pnpm run dev:db:generate`

This will add a new migration script, then you have to run it :

`pnpm run dev:db:migrate`

Once the database is updated, add new schemas, if needed, in the schema pacakge.

Once done, create the associated types running :

1. `pnpm build`

### Run SQL queries

To open psql, run `docker exec -it bitcoin-learning-management-system-postgres-1 psql -U postgres -d postgres`
