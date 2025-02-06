import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  introspect: {
    casing: 'camel',
  },
  casing: 'snake_case',
  schemaFilter: ['users', 'content'],
  dbCredentials: {
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'postgres',
    ssl:
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'testnet'
        ? 'prefer'
        : false,
  },
});
