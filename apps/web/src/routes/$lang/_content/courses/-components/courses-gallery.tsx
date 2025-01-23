import { useLocation } from '@tanstack/react-router';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

import type { JoinedCourse } from '@blms/types';
import { Button } from '@blms/ui';

import { CourseCard } from '#src/organisms/course-card.tsx';
import { FilterDropdown } from '#src/organisms/filter-dropdown.tsx';

import { toggleSelection } from '../-utils/course-utils.tsx';

export const CoursesGallery = ({ courses }: { courses: JoinedCourse[] }) => {
  const location = useLocation();

  const topics = [
    'all',
    ...[...new Set(courses.map((course) => course.topic))].sort(),
  ];

  const levels = ['all', 'beginner', 'intermediate', 'advanced', 'wizard'];

  const mobileLevels = [
    'all',
    'advanced',
    'beginner',
    'wizard',
    'intermediate',
  ];

  const [activeLevels, setActiveLevels] = useState<string[]>(['all']);
  const [filteredCourses, setFilteredCourses] = useState<JoinedCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const featuredCourseId = 'btc101';

  const getDefaultTopic = () => {
    const hash = location.hash.replace('#', '').replaceAll('%20', ' ');
    const validTopics = topics.map((topic) => topic);
    return validTopics.includes(hash) ? hash : topics[0];
  };

  const [activeTopics, setActiveTopics] = useState<string[]>([
    getDefaultTopic(),
  ]);

  // Sync topic with URL hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (topics.includes(hash)) {
      setActiveTopics([hash]);
    }
  }, [location.hash]);

  useEffect(() => {
    window.location.hash =
      activeTopics.length === 1 && activeTopics[0] !== 'all'
        ? activeTopics[0]
        : '';
  }, [activeTopics]);

  useEffect(() => {
    const reorderedCourses = [
      ...courses.filter((course) => course.id === featuredCourseId),
      ...courses.filter((course) => course.id !== featuredCourseId),
    ];

    setFilteredCourses(
      reorderedCourses.filter(
        (course) =>
          (activeTopics.includes('all') ||
            activeTopics.includes(course.topic)) &&
          (activeLevels.includes('all') ||
            activeLevels.includes(course.level)) &&
          course.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [courses, activeTopics, activeLevels, searchQuery]);

  const handleFilterChange = (category: string, option: string) => {
    if (category === 'Topics') {
      toggleSelection(option, activeTopics, setActiveTopics);
    } else if (category === 'Levels') {
      toggleSelection(option, activeLevels, setActiveLevels);
    }
  };

  const featuredCourse = filteredCourses.find(
    (course) => course.id === featuredCourseId,
  );
  const otherCourses = filteredCourses.filter(
    (course) => course.id !== featuredCourseId,
  );

  return (
    <>
      <div className="max-md:hidden mt-12 max-w-[730px] xl:max-w-[1126px] mx-auto">
        <p className="desktop-h6">{t('courses.explorer.buildPath')}</p>
        <div className="flex flex-col p-5 gap-8 bg-tertiary-10 mt-5 rounded-[20px] max-w-[1126px] mx-auto">
          <div className="flex items-center gap-8 font-medium">
            <p>{t('words.topics')}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={
                  activeTopics.includes('all') ? 'primary' : 'outlineWhite'
                }
                size="s"
                onClick={() =>
                  toggleSelection('all', activeTopics, setActiveTopics)
                }
              >
                {t('words.all')}
              </Button>
              {topics.slice(1).map((topic) => (
                <Button
                  key={topic}
                  variant={
                    activeTopics.includes(topic) ? 'primary' : 'outlineWhite'
                  }
                  size="s"
                  onClick={() =>
                    toggleSelection(topic, activeTopics, setActiveTopics)
                  }
                  className="capitalize"
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8 font-medium">
            <p>{t('words.level.levels')}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={
                  activeLevels.includes('all') ? 'primary' : 'outlineWhite'
                }
                size="s"
                onClick={() =>
                  toggleSelection('all', activeLevels, setActiveLevels)
                }
              >
                {t('words.all')}
              </Button>
              {levels.slice(1).map((level) => (
                <Button
                  key={level}
                  variant={
                    activeLevels.includes(level) ? 'primary' : 'outlineWhite'
                  }
                  size="s"
                  onClick={() =>
                    toggleSelection(level, activeLevels, setActiveLevels)
                  }
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden w-full max-w-[500px] mx-auto">
        <FilterDropdown
          filters={{
            Topics: topics,
            Levels: mobileLevels,
          }}
          selectedFilters={{
            Topics: activeTopics,
            Levels: activeLevels,
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onChange={handleFilterChange}
        />
      </div>

      <section className="flex justify-center gap-5 md:gap-[50px] flex-wrap mt-8 md:mt-12 mb-5 lg:mb-[60px] max-w-[1226px] mx-auto">
        {featuredCourse && <CourseCard course={featuredCourse} featured />}
        {otherCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>
    </>
  );
};
