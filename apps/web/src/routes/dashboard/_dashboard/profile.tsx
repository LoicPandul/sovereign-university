import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { t } from 'i18next';
import type { ChangeEvent } from 'react';
import { useContext, useState } from 'react';

import { Button, Tabs, TabsContent } from '@blms/ui';

import SignInIconLight from '#src/assets/icons/profile_log_in_light.svg';
import { TabsListUnderlined } from '#src/components/Tabs/TabsListUnderlined.js';
import { AppContext } from '#src/providers/context.js';
import { getPictureUrl, setProfilePicture } from '#src/services/user.js';

import { useDisclosure } from '../../../hooks/index.ts';

import { ChangeDisplayNameModal } from './-components/change-display-name-modal.tsx';
import { ChangeEmailModal } from './-components/change-email-modal.tsx';
import { ChangePasswordModal } from './-components/change-password-modal.tsx';
import { ChangePictureModal } from './-components/change-picture-modal.tsx';

export const Route = createFileRoute('/dashboard/_dashboard/profile')({
  component: DashboardProfile,
});

function DashboardProfile() {
  const navigate = useNavigate();
  const { user, setUser, session } = useContext(AppContext);
  if (!session) {
    navigate({ to: '/' });
  }

  const [file, setFile] = useState<File | null>(null);
  const pictureUrl = getPictureUrl(user);
  const profilePictureDisclosure = useDisclosure();

  // Called when the user selects a profile picture to upload
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setFile(target.files![0]);
    profilePictureDisclosure.open();
    target.value = '';
  };

  // Called when the user has cropped his profile picture
  const onPictureChange = (file: File) => {
    setProfilePicture(file)
      .then(setUser)
      .finally(profilePictureDisclosure.close)
      .catch((error) => console.error('Error:', error));
  };

  const {
    open: openChangePasswordModal,
    isOpen: isChangePasswordModalOpen,
    close: onClosePasswordModal,
  } = useDisclosure();

  const {
    open: openChangeDisplayNameModal,
    isOpen: isChangeDisplayNameModalOpen,
    close: onCloseDisplayNameModal,
  } = useDisclosure();

  const changeEmailModal = useDisclosure();
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [currentTab, setCurrentTab] = useState('info');

  const onTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <div className="text-2xl">
        {t('dashboard.profile.profileInformation')}
      </div>
      <Tabs
        defaultValue="info"
        value={currentTab}
        onValueChange={onTabChange}
        className="max-w-[600px]"
      >
        <TabsListUnderlined
          tabs={[
            {
              key: 'info',
              value: 'info',
              text: t('dashboard.profile.personalInformation'),
              active: 'info' === currentTab,
            },
            {
              key: 'security',
              value: 'security',
              text: t('dashboard.profile.security'),
              active: 'security' === currentTab,
            },
          ]}
        />
        <TabsContent value="info">
          <div className="flex w-full flex-col">
            <div className="mt-6 flex flex-col">
              <label htmlFor="usernameId">
                {t('dashboard.profile.username')}
              </label>
              <input
                id="usernameId"
                type="text"
                value={user?.username}
                disabled
                className="rounded-md bg-[#e9e9e9] px-4 py-1 text-gray-400 border border-gray-400/10"
              />
            </div>
            <div className="mt-6">
              <label htmlFor="displayName">
                {t('dashboard.profile.displayName')}
              </label>
              <div className="flex max-lg:flex-col lg:items-center gap-4">
                <input
                  id="displayName"
                  type="text"
                  value={user?.displayName || ''}
                  disabled
                  className="rounded-md bg-[#e9e9e9] px-4 py-1 text-gray-400 border border-gray-400/10 grow"
                />
                <Button
                  variant="outline"
                  size="s"
                  onClick={openChangeDisplayNameModal}
                  className="h-[34px] px-3 w-fit"
                >
                  {t('dashboard.profile.edit')}
                </Button>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex flex-col">
                <label htmlFor="emailId">{t('dashboard.profile.email')}</label>

                <div className="flex max-lg:flex-col lg:items-center gap-4">
                  <input
                    id="emailId"
                    type="text"
                    value={user?.email ?? ''}
                    disabled
                    className="rounded-md bg-[#e9e9e9] px-4 py-1 text-gray-400 border border-gray-400/10 grow"
                  />

                  <Button
                    variant="outline"
                    size="s"
                    onClick={changeEmailModal.open}
                    className="h-[34px] px-3 w-fit"
                  >
                    {t('dashboard.profile.edit')}
                  </Button>
                </div>
              </div>

              {/* Confirmation message */}
              <div>
                {emailSent && (
                  <div className="mt-6 text-green-500">
                    {t('dashboard.profile.emailChangeConfirmation')}
                  </div>
                )}
                {emailError && (
                  <div className="mt-6 text-red-5">
                    {t('dashboard.profile.' + emailError)}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Picture Zone */}
            <div className="mt-6 flex flex-col">
              <label htmlFor="profilePictureFile">
                {t('dashboard.profile.profilePicture')}
              </label>

              <div className="mt-2 max-md:flex-col flex gap-8 lg:items-end">
                <img
                  src={pictureUrl ?? SignInIconLight}
                  alt="Profile"
                  className="rounded-full size-32"
                />

                <div>
                  <Button variant="outline" size="m" className="p-0">
                    <label
                      htmlFor="profilePictureFile"
                      className="px-2.5 py-1.5 cursor-pointer"
                    >
                      {t('dashboard.profile.edit')}
                    </label>
                  </Button>
                  <input
                    className="hidden"
                    type="file"
                    name="file"
                    id="profilePictureFile"
                    accept="image/*"
                    onChange={onFileChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="mt-6 flex justify-between">
            <div>{t('dashboard.profile.password')}</div>
            <Button
              variant="primary"
              size="s"
              onClick={openChangePasswordModal}
            >
              {t('dashboard.profile.change')}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="document"></TabsContent>
      </Tabs>

      <ChangeDisplayNameModal
        isOpen={isChangeDisplayNameModalOpen}
        onClose={() => {
          onCloseDisplayNameModal();
        }}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={onClosePasswordModal}
      />

      <ChangePictureModal
        file={file}
        onChange={onPictureChange}
        onClose={profilePictureDisclosure.close}
        isOpen={profilePictureDisclosure.isOpen}
      />

      <ChangeEmailModal
        isOpen={changeEmailModal.isOpen}
        onClose={changeEmailModal.close}
        onEmailSent={(data) => {
          if (data.success) {
            setEmailSent(true);
          } else {
            setEmailSent(false);
            setEmailError(data.error ?? "An error occurred");
          }
        }}
        email={user?.email || ''}
      />
    </div>
  );
}
