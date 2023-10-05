import { Route } from '@tanstack/react-router';
import { rootRoute } from './root';
import { NotFound } from '../pages/not-found';
import { UnderConstruction } from '../pages/under-construction';

const miscRootRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'misc',
});

export const notFoundRoute = new Route({
  getParentRoute: () => miscRootRoute,
  path: '404',
  component: NotFound,
});

export const underConstructionRoute = new Route({
  getParentRoute: () => miscRootRoute,
  path: 'under-construction',
  component: UnderConstruction,
});

export const miscRoutes = miscRootRoute.addChildren([
  notFoundRoute,
  underConstructionRoute,
]);
