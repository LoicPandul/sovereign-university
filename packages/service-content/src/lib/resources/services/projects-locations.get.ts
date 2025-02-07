import type { ProjectLocation } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getProjectsLocationsQuery } from '../queries/projects-locations.js';

export const createGetProjectsLocations = ({ postgres }: Dependencies) => {
  return (): Promise<ProjectLocation[]> => {
    return postgres.exec(getProjectsLocationsQuery());
  };
};
