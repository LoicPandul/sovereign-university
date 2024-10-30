import { firstRow } from '@blms/database';
import type { UserAccount } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { getUserQuery } from '../queries/get-user.js';

type GetUserOptions =
  | {
      uid: string;
    }
  | {
      username: string;
    }
  | {
      lud4PublicKey: string;
    };

export const createGetUser = ({ postgres }: Dependencies) => {
  return (options: GetUserOptions): Promise<UserAccount | null> => {
    return postgres
      .exec(getUserQuery(options))
      .then(firstRow)
      .then((user) => user ?? null)
      .then((user) => (console.log(user), user ?? null));
  };
};
