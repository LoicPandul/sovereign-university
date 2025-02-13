import fs from 'node:fs';
import process from 'node:process';

import type { PostgresClientConfig } from '@blms/database';
import type { RedisClientConfig } from '@blms/redis';
import type {
  GitHubSyncConfig,
  OpenTimestampsConfig,
  S3Config,
  SendGridConfig,
  SessionConfig,
  StripeConfig,
  SwissBitcoinPayConfig,
  TypesenseConfig,
} from '@blms/types';

function getenv<
  T,
  R = T extends unknown ? string : T extends null ? string | null : T,
>(name: string, fallback?: T): R {
  const value = process.env[name] ?? '';

  // If the value is empty and no fallback is provided, throw an error
  if (!value && fallback === undefined) {
    throw new Error(`Missing mandatory value for "${name}"`);
  }

  // If the value is empty and a fallback is provided, log a warning
  if (!value) {
    console.warn(
      `No value found for ${name}, defaulting to ${JSON.stringify(fallback)}`,
    );
  }

  // If the value is not empty, parse it to the correct type (inferred from fallback type)
  if (fallback !== null) {
    switch (typeof fallback) {
      case 'boolean': {
        return (value ? value === 'true' : fallback) as R;
      }
      case 'number': {
        return (Number.parseInt(value) || fallback) as R;
      }
    }
  }

  return (value || fallback) as R;
}

export const production = getenv('NODE_ENV') === 'production';

/**
 * Application domain (without protocol)
 */
export const domain = getenv('DOMAIN', 'localhost:8181');

export const docker: boolean = getenv('DOCKER', false);

export const protectSyncRoute: boolean = getenv('PROTECT_SYNC_ROUTE', true);

/**
 * Real application domain (without trailing slash)
 */
export const domainUrl = getenv('DOMAIN_URL', 'http://localhost:8181');

export const sendgrid: SendGridConfig = {
  key: getenv('SENDGRID_KEY', null),
  enable: getenv('SENDGRID_ENABLE', false),
  email: getenv('SENDGRID_EMAIL', null),
  templates: {
    emailChange: getenv('SENDGRID_EMAIL_CHANGE_TEMPLATE_ID', null),
    resetPassword: getenv('SENDGRID_RESET_PASSWORD_TEMPLATE_ID', null),
  },
};

export const postgres: PostgresClientConfig = {
  host: getenv('POSTGRES_HOST', 'localhost'),
  port: getenv('POSTGRES_PORT', 5432),
  database: getenv('POSTGRES_DB'),
  username: getenv('POSTGRES_USER'),
  password: getenv('POSTGRES_PASSWORD'),
};

export const redis: RedisClientConfig = {
  host: getenv('REDIS_HOST', 'localhost'),
  port: getenv('REDIS_PORT', 6379),
  database: getenv('REDIS_DB', 0),
  password: process.env.REDIS_PASSWORD, // We do not use getenv here because
  username: process.env.REDIS_USERNAME, // these values can be undefined
};

export const sync: GitHubSyncConfig = {
  cdnPath: getenv('CDN_PATH', '/tmp/cdn'),
  syncPath: getenv('SYNC_PATH', '/tmp/sync'),
  publicRepositoryUrl: getenv('DATA_REPOSITORY_URL'),
  publicRepositoryBranch: getenv('DATA_REPOSITORY_BRANCH', 'main'),
  privateRepositoryUrl: getenv('PRIVATE_DATA_REPOSITORY_URL', null),
  privateRepositoryBranch: getenv('PRIVATE_DATA_REPOSITORY_BRANCH', 'main'),
  githubAccessToken: getenv('GITHUB_ACCESS_TOKEN', null),
};

export const session: SessionConfig = {
  cookieName: getenv('SESSION_COOKIE_NAME', 'session'),
  secret: getenv('SESSION_SECRET', 'super secret'),
  maxAge: getenv('SESSION_MAX_AGE', 1000 * 60 * 60 * 24 * 7), // 1 week
  secure: production,
  domain: production ? domain : undefined,
};

export const stripe: StripeConfig = {
  publicKey: getenv('VITE_STRIPE_PUBLIC', null),
  secret: getenv('STRIPE_SECRET', ''),
  endpointSecret: getenv('STRIPE_ENDPOINT_SECRET', null),
};

export const swissBitcoinPay: SwissBitcoinPayConfig = {
  apiKey: getenv('SBP_API_KEY', null),
  proxyUrl: getenv('PUBLIC_PROXY_URL', null),
};

const rpcUrl = getenv('OTS_RPC_URL', null);
const rpcUser = getenv('OTS_RPC_USER', null);
const rpcPassword = getenv('OTS_RPC_PASSWORD', null);
const pgpKeyPath = docker ? '/tmp/key.asc' : getenv('OTS_PGP_KEY_PATH', null);
export const opentimestamps: OpenTimestampsConfig = {
  armoredKey: pgpKeyPath && fs.readFileSync(pgpKeyPath, 'utf8'),
  passphrase: getenv('OTS_PGP_KEY_PASSPHRASE', null),
  rpc:
    rpcUrl && rpcUser
      ? { url: rpcUrl, user: rpcUser, password: rpcPassword }
      : undefined,
};

export const s3: S3Config = {
  endpoint: getenv('S3_ENDPOINT').trim(),
  region: getenv('S3_REGION').trim(),
  bucket: getenv('S3_BUCKET').trim(),
  accessKey: getenv('S3_ACCESS_KEY').trim(),
  secretKey: getenv('S3_SECRET_KEY').trim(),
};

export const typesense: TypesenseConfig = {
  apiKey: getenv('TYPESENSE_API_KEY', 'xyz'),
  nodes: getenv('TYPESENSE_NODES', 'http://typesense:8108')
    .split(',')
    .map((url) => ({ url })),
};
