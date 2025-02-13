// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

export type TokenType = 'validate_email' | 'reset_password' | 'login';

export interface Token {
  id: string;
  uid: string;
  type: TokenType;
  data: string | null;
  expiresAt: Date;
  consumedAt: Date | null;
}
