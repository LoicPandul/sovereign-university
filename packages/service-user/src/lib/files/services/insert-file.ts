import { randomUUID } from 'node:crypto';

import { firstRow, rejectOnEmpty, sql } from '@blms/database';
import type { UserFile } from '@blms/types';

import type { Dependencies } from '#src/dependencies.js';

interface UserFileInput {
  filename: string;
  mimetype: string;
  filesize: number;
  checksum: string;
  data: Buffer;
}

export const createInsertFile = ({ postgres, s3 }: Dependencies) => {
  return async (
    uid: string,
    input: UserFileInput,
  ): Promise<Omit<UserFile, 'data'>> => {
    const id = randomUUID();
    const s3Key = `user-files/${id}`;

    await s3.put(s3Key, input.data, input.mimetype);

    return postgres //
      .exec(
        sql<UserFile[]>`
          INSERT INTO users.files (id, uid, filename, mimetype, filesize, checksum, s3_key)
          VALUES (${id}, ${uid}, ${input.filename}, ${input.mimetype}, ${input.filesize}, ${input.checksum}, ${s3Key})
          RETURNING id, uid, s3_key, filename, mimetype, filesize, checksum, created_at, updated_at
          ;
        `,
      )
      .then(firstRow)
      .then(rejectOnEmpty);
  };
};
