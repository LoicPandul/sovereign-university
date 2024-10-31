import type { UserRole } from './index.js';

export interface SessionData {
  uid: string;
  role: UserRole;
}
