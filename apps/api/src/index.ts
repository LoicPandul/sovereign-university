import type {} from 'express-serve-static-core';
import type {} from 'qs';
import 'express-session';

import { pathToFileURL } from 'node:url';

import * as dotenv from 'dotenv';

import type { SessionData as ApiSessionDAta } from '@blms/types';

import { startDependencies } from './dependencies.js';
import { startServer } from './server.js';

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData extends ApiSessionDAta {}
}

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const start = async () => {
  const { dependencies, stopDependencies } = await startDependencies();
  const server = await startServer(dependencies, port);

  server.once('close', async () => {
    await stopDependencies();

    server.close();
  });
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await start();
}
