import type { GenerateTicketOptions } from '../../pdf/generate-ticket.js';
import { generateTicket } from '../../pdf/generate-ticket.js';

export const generateEventTicket = (options: GenerateTicketOptions) => {
  return generateTicket(options);
};
