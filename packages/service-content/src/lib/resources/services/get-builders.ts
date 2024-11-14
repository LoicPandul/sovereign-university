import type { JoinedBuilder } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getBuildersQuery } from '../queries/get-builders.js';

export const createGetBuilders = ({ postgres }: Dependencies) => {
  return (language?: string): Promise<JoinedBuilder[]> => {
    return postgres.exec(getBuildersQuery(language));
  };
};
