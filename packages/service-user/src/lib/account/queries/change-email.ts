import { sql } from '@blms/database';

import type { UserAccount } from '@blms/types';

export const changeEmailWithTokenQuery = (id: string) => {
  return sql<Array<Pick<UserAccount, 'email'>>>`
    WITH token AS (
      UPDATE users.tokens
      SET consumed_at = NOW()
      WHERE id = ${id} AND type = 'validate_email'
        AND consumed_at IS NULL
        AND expires_at > NOW()
      RETURNING uid, data
    )
    UPDATE users.accounts
    SET email = token.data
    FROM token
    WHERE users.accounts.uid = token.uid
    RETURNING email;
  `;
};

export const changeEmailQuery = (uid: string, email: string) => {
  return sql<Array<Pick<UserAccount, 'email'>>>`
    UPDATE users.accounts
    SET email = ${email}
    WHERE uid = ${uid}
    RETURNING email;
  `;
};
