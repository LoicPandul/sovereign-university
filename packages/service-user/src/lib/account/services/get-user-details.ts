import { TRPCError } from '@trpc/server';

import { firstRow } from '@blms/database';
import type { UserDetails } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { getUserQuery } from '../queries/get-user.js';

export const createGetUserDetails = ({ postgres }: Dependencies) => {
  return async ({ uid }: { uid: string }): Promise<UserDetails> => {
    const user = await postgres.exec(getUserQuery({ uid })).then(firstRow);
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }

    return user;
  };
};
