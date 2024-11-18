import { TRPCError } from '@trpc/server';
import type { NextFunction, Request, Response } from 'express';

import type { UserRole } from '@blms/types';

import { Unauthorized } from '#src/errors.js';

import { createMiddleware } from '../trpc/index.js';

/**
 * TRPC middleware that loads the user context from the session.
 * Must be used before any other middleware that requires the user context.
 */
export const loadContextMiddleware = createMiddleware(({ ctx, next }) => {
  const { req } = ctx;

  const userRole = req.session.role;
  const userId = req.session.uid;

  return next({
    ctx: { user: { uid: userId, role: userRole } },
  });
});

/**
 * TRPC middleware that enforces that the user is authenticated.
 */
export const enforceAuthenticatedUserMiddleware = (requiredRole: UserRole) => {
  return createMiddleware(({ ctx, next }) => {
    // For every role, user must be logged in
    if (!ctx.user?.uid || !ctx.user?.role) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const { role, uid } = ctx.user;

    // Super admin case
    if (role === 'superadmin' && role !== 'superadmin') {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // Current user is not an admin
    if (role !== 'superadmin' && role !== 'admin') {
      // Admin case
      if (requiredRole === 'admin') {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      // Professor case
      if (requiredRole === 'professor' && role !== 'professor') {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      // Community case
      if (requiredRole === 'community' && role !== 'community') {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
    }

    return next({ ctx: { user: { role, uid } } });
  });
};

/**
 * Express middleware that enforces that the user is authenticated.
 */
export const expressAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.uid) {
    throw new Unauthorized();
  }

  next();
};
