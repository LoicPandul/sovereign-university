import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs, TabsContent, TabsList, TabsTrigger, TextTag } from '@blms/ui';

import { useSmaller } from '#src/hooks/use-smaller.ts';
import { AppContext } from '#src/providers/context.js';

import { RoleAllocationTable } from '../-components/role-allocation-table.tsx';

export const Route = createFileRoute(
  '/dashboard/_dashboard/administration/role',
)({
  component: DashboardAdministrationRole,
});

function DashboardAdministrationRole() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { session } = useContext(AppContext);
  if (!session) {
    navigate({ to: '/' });
  } else if (
    session?.user.role !== 'admin' &&
    session?.user.role !== 'superadmin'
  ) {
    navigate({ to: '/dashboard/courses' });
  }

  const isTablet = useSmaller('lg');

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <div className="flex max-lg:flex-col lg:items-center gap-2 lg:gap-5">
        <h1 className="display-small-32px">
          {t('dashboard.adminPanel.userRolesAllocation')}
        </h1>
        <TextTag
          size={isTablet ? 'verySmall' : 'small'}
          className="uppercase w-fit"
        >
          {t('words.admin')}
        </TextTag>
      </div>

      <Tabs defaultValue="students" className="w-full max-w-[900px]">
        <TabsList>
          <TabsTrigger
            value="students"
            className="text-gray-500 data-[state=active]:text-black data-[state=inactive]:hover:text-black text-wrap"
          >
            {t('words.students')}
          </TabsTrigger>
          <TabsTrigger
            value="professors"
            className="text-gray-500 data-[state=active]:text-black data-[state=inactive]:hover:text-black text-wrap"
          >
            {t('words.professors')}
          </TabsTrigger>
          <TabsTrigger
            value="admins"
            className="text-gray-500 data-[state=active]:text-black data-[state=inactive]:hover:text-black text-wrap"
          >
            {t('words.admins')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <RoleAllocationTable userRole="student" />
        </TabsContent>
        <TabsContent value="professors">
          <RoleAllocationTable userRole="professor" />
        </TabsContent>
        <TabsContent value="admins">
          <RoleAllocationTable userRole="admin" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
