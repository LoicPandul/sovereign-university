// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

export interface Invoice {
  title: string;
  type: string;
  amount: number;
  paymentMethod: string;
  url: string;
  date: Date;
}

export interface Ticket {
  eventId: string;
  title: string;
  location: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  timezone: string;
  type: string;
  date: Date;
  isInPerson: boolean;
  isOnline: boolean;
}
