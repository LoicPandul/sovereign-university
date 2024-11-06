import type { PostgresClient } from '@blms/database';
import type { S3Service } from '@blms/s3';

export interface Dependencies {
  postgres: PostgresClient;
  s3: S3Service;
}
