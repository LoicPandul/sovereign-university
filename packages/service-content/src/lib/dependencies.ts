import type { Client as TypesenseClient } from 'typesense';

import type { PostgresClient } from '@blms/database';
import type { S3Service } from '@blms/s3';

export interface Dependencies {
  typesense: TypesenseClient;
  postgres: PostgresClient;
  s3: S3Service;
}
