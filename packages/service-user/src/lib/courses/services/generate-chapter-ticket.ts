import type { GenerateTicketOptions } from '../../pdf/generate-ticket.js';
import { generateTicket } from '../../pdf/generate-ticket.js';

export const generateChapterTicket = (options: GenerateTicketOptions) => {
  return generateTicket(options);
};
