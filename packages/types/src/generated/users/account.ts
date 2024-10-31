// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

export type UserRole =
  | 'student'
  | 'professor'
  | 'community'
  | 'admin'
  | 'superadmin';

export interface UserAccount {
  uid: string;
  username: string;
  displayName: string | null;
  certificateName: string | null;
  picture: string | null;
  email: string | null;
  role: UserRole;
  lastEmailChangeRequest: Date | null;
  currentEmailChecked: boolean;
  passwordHash: string | null;
  contributorId: string;
  professorId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetails {
  uid: string;
  role: UserRole;
  email: string | null;
  picture: string | null;
  username: string;
  displayName: string | null;
  certificateName: string | null;
  professorId: number | null;
  contributorId: string;
  professorCourses: string[];
  professorTutorials: number[];
}

export interface UserRoles {
  uid: string;
  username: string;
  displayName: string | null;
  certificateName: string | null;
  email: string | null;
  contributorId: string;
  role: UserRole;
  professorId: number | null;
  professorName?: string | undefined;
}

export interface UsersLud4PublicKey {
  id: string;
  uid: string;
  publicKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  status: number;
  message: string;
  user: {
    uid: string;
    username: string;
    email: string | null;
  };
}
