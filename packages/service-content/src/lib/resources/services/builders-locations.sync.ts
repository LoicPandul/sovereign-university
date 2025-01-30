import { z } from 'zod';

import type { Dependencies } from '../../dependencies.js';
import {
  getBuildersWithoutLocationQuery,
  setBuilderLocationQuery,
} from '../queries/builders-locations.js';

const expectedResponseSchema = z.array(
  z
    .object({
      name: z.string(),
      place_id: z.number(),
      place_rank: z.number(),
      display_name: z.string(),
      lat: z.string(),
      lon: z.string(),
    })
    .transform((data) => ({
      placeId: data.place_id,
      lat: Number.parseFloat(data.lat),
      lng: Number.parseFloat(data.lon),
    })),
);

const fetchBuilderLocation = async (query: string) => {
  const q = encodeURIComponent(query);

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${q}`,
  );
  console.log('Searching location for:', query);

  const data = await res.json();
  return expectedResponseSchema.parse(data)?.[0];
};

export const createSyncBuildersLocations = ({ postgres }: Dependencies) => {
  return async (syncWarnings: string[]) => {
    try {
      const locations = await postgres.exec(getBuildersWithoutLocationQuery());

      for (const { name } of locations) {
        const result = await fetchBuilderLocation(name).catch(() => null);
        if (!result) {
          const warn = `-- Sync procedure: Could not find builder location: ${name}`;
          syncWarnings.push(warn);
          continue;
        }

        await postgres.exec(setBuilderLocationQuery({ ...result, name }));
      }
    } catch (error) {
      const errMsg = `'-- Error during builders locations sync: ${error}`;
      syncWarnings.push(errMsg);
      console.error(errMsg);
    }
  };
};
