import type { Dependencies } from '../../../dependencies.js';
import { getLanguagesQuery } from '../queries/get-languages.js';

export const createGetLanguages = ({ postgres }: Dependencies) => {
  return async () => {
    const languages = await postgres.exec(getLanguagesQuery());

    if (!languages) {
      return null;
    }

    return languages;
  };
};
