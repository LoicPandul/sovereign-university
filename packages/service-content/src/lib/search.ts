import type { Client as TypesenseClient } from 'typesense';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js';

import { sql } from '@blms/database';

import { ISO_639_LANGUAGES, type Language } from './const.js';
import type { Dependencies } from './dependencies.js';

export interface Searchable extends Record<string, unknown> {
  language: Language;
  premium?: boolean;
  title: string;
  body: string;
  link: string;
}

const getCoursesQuery = () => sql<Searchable[]>`
 SELECT
    'course' as type,
    course_id,
    LOWER(language) as language,
    name as title,
    raw_description as body,
    CONCAT('/', language, '/courses/', course_id) as link
 FROM content.courses_localized ;
`;

const getCoursePartsQuery = () => sql<Searchable[]>`
  SELECT
    'course_part' as type,
    cp.course_id,
    cp.part_id,
    first_chapter.chapter_id as first_chapter_id,
    LOWER(language) as language,
    CONCAT('/', language, '/courses/', cp.course_id, '/', first_chapter.chapter_id) as link,
    cp.title,
    '' as body
  FROM content.course_parts_localized cp
  JOIN content.course_chapters first_chapter
    ON first_chapter.course_id = cp.course_id
    AND first_chapter.part_id = cp.part_id
    AND first_chapter.chapter_index = 1 ;
`;

const getCourseChaptersQuery = () => sql<Searchable[]>`
  SELECT
    'course_chapter' as type,
    LOWER(language) as language,
    CONCAT('/', language, '/courses/', course_id, '/', chapter_id) as link,
    title,
    raw_content as body
  FROM content.course_chapters_localized
  WHERE LENGTH(raw_content) > 0
`;

const getProfessorsQuery = () => sql<Searchable[]>`
  SELECT
    'professor' as type,
    p.name as title,
    LOWER(language) as language,
    bio,
    short_bio as body,
    CONCAT(
      '/',
      language,
      '/',
      REPLACE(p.path, 'professors/', 'professor/'),
      '-',
      p.id
    ) as link
    FROM content.professors_localized
    JOIN content.professors p ON p.id = professor_id
`;

const getTutorialsQuery = () => sql<Searchable[]>`
 SELECT
    'tutorial' as type,
    category,
    subcategory,
    tutorial_id,
    LOWER(language) as language,
    title,
    COALESCE(description, '') as body,
    CONCAT('/', language, '/tutorials/', category, '/', subcategory, '/', tutorial_id) as link
  FROM content.tutorials_localized
  JOIN content.tutorials t ON t.id = tutorial_id
`;

const getBooksQuery = () => sql<Searchable[]>`
  SELECT
      'book' as type,
      book_id,
      LOWER(language) as language,
      CONCAT(author, ': ', title) as title,
      original,
      description as body,
      CONCAT('/', language, '/resources/books/', book_id) as link
    FROM content.books_localized
    JOIN content.books b ON b.resource_id = book_id
  `;

const getPodcastsQuery = () => sql<Searchable[]>`
  SELECT
      'podcast' as type,
      LOWER(language) as language,
      name as title,
      description as body,
      CONCAT(
        '/',
        language,
        '/resources/podcasts/',
        LOWER(REPLACE(name, ' ', '-')),
        '-',
        resource_id
      ) as link
    FROM content.podcasts
  `;

const createInitIndexes = (client: TypesenseClient) => () => {
  const searchableSchema: CollectionCreateSchema = {
    name: 'searchable',
    fields: [
      { name: 'type', type: 'string', facet: true },
      { name: 'language', type: 'string', facet: true },
      { name: 'title', type: 'string', facet: false },
      { name: 'body', type: 'string', facet: false },
    ],
  };

  return client
    .collections()
    .create(searchableSchema)
    .then(() => console.log('[SEARCH] Index created'));
};

const createDeleteIndexes = (client: TypesenseClient) => () => {
  return client
    .collections('searchable')
    .delete()
    .then(() => console.log('[SEARCH] Index deleted'))
    .catch((error) => console.error('[SEARCH] Failed to delete index:', error));
};

const createIngestData = (client: TypesenseClient) => (data: Searchable[]) => {
  return client
    .collections('searchable')
    .documents()
    .import(
      data.map((part) => ({
        ...part,
        // https://typesense.org/docs/guide/locale.html#best-practices
        locale: ISO_639_LANGUAGES[part.language],
      })),
    )
    .catch((error) => console.error('[SEARCH] Import failed:', error));
};

/* eslint-disable @typescript-eslint/no-unused-vars */
export const createIndexContent = ({ postgres, typesense }: Dependencies) => {
  const deleteIndexes = createDeleteIndexes(typesense);
  const createIndexes = createInitIndexes(typesense);
  const ingestData = createIngestData(typesense);

  return async (_errors: string[]) => {
    const timeKey = '-- Sync procedure: indexing content';
    console.time(timeKey);
    console.log(timeKey + '...');

    // return;
    await deleteIndexes();
    await createIndexes();

    const data: Searchable[] = [
      ...(await postgres.exec(getCoursePartsQuery())),
      ...(await postgres.exec(getCourseChaptersQuery())),
      ...(await postgres.exec(getProfessorsQuery())),
      ...(await postgres.exec(getCoursesQuery())),
      ...(await postgres.exec(getTutorialsQuery())),
      ...(await postgres.exec(getBooksQuery())),
      ...(await postgres.exec(getPodcastsQuery())),
      // Test data
      {
        type: 'course_chapter',
        course_id: 0,
        chapter_id: 0,
        language: 'en' as Language,
        title: 'Hello world, test the testing search for testing',
        body: 'Hello world, test the testing search for testing',
        link: '/en/courses/0',
        dummy: 'value',
      },
    ];

    await ingestData(data);

    console.log(`[SEARCH] Imported ${data.length} documents`);

    console.timeEnd(timeKey);
  };
};
