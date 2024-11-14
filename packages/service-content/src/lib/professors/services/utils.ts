import type { FormattedProfessor, JoinedProfessor } from '@blms/types';

import { omit } from '../../utils.js';

export const formatProfessor = (
  professor: JoinedProfessor,
): FormattedProfessor => {
  return {
    ...omit(professor, [
      'websiteUrl',
      'twitterUrl',
      'githubUrl',
      'nostr',
      'lightningAddress',
      'lnurlPay',
      'paynym',
      'silentPayment',
      'tipsUrl',
    ]),
    lastSync: new Date(professor.lastSync),
    lastUpdated: new Date(professor.lastUpdated),
    links: {
      website: professor.websiteUrl,
      twitter: professor.twitterUrl,
      github: professor.githubUrl,
      nostr: professor.nostr,
    },
    tips: {
      lightningAddress: professor.lightningAddress,
      lnurlPay: professor.lnurlPay,
      paynym: professor.paynym,
      silentPayment: professor.silentPayment,
      url: professor.tipsUrl,
    },
  };
};
