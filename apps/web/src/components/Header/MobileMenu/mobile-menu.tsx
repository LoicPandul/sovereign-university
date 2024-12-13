import { Link, useLocation } from '@tanstack/react-router';
import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HiMiniBars3 } from 'react-icons/hi2';
import { IoMdClose } from 'react-icons/io';

import { cn } from '@blms/ui';

import { AppContext } from '#src/providers/context.js';
import { MenuDashboard } from '#src/routes/dashboard/_dashboard/-components/menu-dashboard.tsx';
import { getPictureUrl } from '#src/services/user.js';

import SignInIconDark from '../../../assets/icons/profile_log_in_dark.svg';
import SignInIconLight from '../../../assets/icons/profile_log_in_light.svg';
import PlanBLogoOrange from '../../../assets/logo/planb_logo_horizontal_white_orangepill_whitetext.svg?react';
import PlanBLogoWhite from '../../../assets/logo/planb_logo_horizontal_white_whitepill.svg?react';
import { useDisclosure } from '../../../hooks/index.ts';
import { LanguageSelectorMobile } from '../language-selector.tsx';
import type { NavigationSectionMobile } from '../props.ts';

import { MobileMenuSection } from './mobile-menu-section.tsx';

export interface MobileMenuProps {
  sections: NavigationSectionMobile[];
  onClickLogin: () => void;
  variant?: 'light' | 'dark';
}

export const MobileMenu = ({
  sections,
  onClickLogin,
  variant = 'dark',
}: MobileMenuProps) => {
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu } =
    useDisclosure();
  const { isOpen: isDashboardMenuOpen, toggle: toggleDashboardMenu } =
    useDisclosure();
  const { t } = useTranslation();
  const { session, user } = useContext(AppContext);
  const isLoggedIn = !!session;

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dashboardMenuRef = useRef<HTMLDivElement>(null);

  const pictureUrl = getPictureUrl(user);

  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || isDashboardMenuOpen ? 'hidden' : 'auto';

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      )
        toggleMobileMenu();
      if (
        dashboardMenuRef.current &&
        !dashboardMenuRef.current.contains(event.target as Node) &&
        isDashboardMenuOpen
      )
        toggleDashboardMenu();
    };

    if (isMobileMenuOpen || isDashboardMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    isMobileMenuOpen,
    isDashboardMenuOpen,
    toggleMobileMenu,
    toggleDashboardMenu,
  ]);

  useEffect(() => {
    if (isMobileMenuOpen && isDashboardMenuOpen) {
      toggleDashboardMenu();
    }
  }, [isMobileMenuOpen, isDashboardMenuOpen, toggleDashboardMenu]);

  return (
    <>
      <div className="flex w-full justify-center items-center lg:hidden">
        <div
          className={cn('min-w-10 mr-auto', isMobileMenuOpen && 'opacity-0')}
        >
          <HiMiniBars3
            className={cn(
              'cursor-pointer text-white',
              isMobileMenuOpen ? 'rotate-90' : 'rotate-0',
            )}
            style={{
              transition: 'transform 0.4s, color 0.2s',
            }}
            size={25}
            color="#fff"
            onClick={toggleMobileMenu}
          />
        </div>

        <Link to="/" className="mx-auto">
          {variant === 'light' ? (
            <PlanBLogoWhite className="h-[25px] w-auto" />
          ) : (
            <PlanBLogoOrange className="h-[25px] w-auto" />
          )}
        </Link>

        {isLoggedIn ? (
          <div className="text-sm font-semibold ml-auto min-w-8">
            <button
              className="cursor-pointer text-white"
              onClick={toggleDashboardMenu}
            >
              <img
                src={
                  pictureUrl
                    ? pictureUrl
                    : variant === 'light'
                      ? SignInIconLight
                      : SignInIconDark
                }
                alt={t('auth.signIn')}
                className="size-8 rounded-full"
              />
            </button>
          </div>
        ) : (
          <div className="text-sm font-semibold ml-auto min-w-8">
            <button
              className="cursor-pointer text-white"
              onClick={onClickLogin}
            >
              <img
                src={variant === 'light' ? SignInIconLight : SignInIconDark}
                alt={t('auth.signIn')}
                className="size-8"
              />
            </button>
          </div>
        )}
      </div>

      <nav
        className={cn(
          'flex flex-col fixed top-0 left-0 items-center w-full max-w-[320px] h-dvh pb-5 duration-300 overflow-scroll no-scrollbar lg:hidden bg-darkOrange-2 dark:bg-newBlack-2',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          variant === 'dark' && 'dark',
        )}
        ref={mobileMenuRef}
      >
        <div className="flex items-center w-full px-4 py-[15px] text-newBlack-1 dark:text-white">
          <HiMiniBars3
            className={cn(
              'cursor-pointer',
              isMobileMenuOpen ? 'rotate-90' : 'rotate-0',
            )}
            style={{
              transition: 'transform 0.4s, color 0.2s',
            }}
            size={25}
            onClick={toggleMobileMenu}
          />
          <Link to="/" className="ml-5 text-lg font-medium leading-normal">
            {t('words.home')}
          </Link>
          <IoMdClose
            size={24}
            className="text-tertiary-7 dark:text-newGray-3 shrink-0 ml-auto cursor-pointer"
            onClick={toggleMobileMenu}
          />
        </div>
        <ul className="list-none w-full px-4 flex flex-col gap-2.5 my-[15px]">
          {sections.map((section) => (
            <MobileMenuSection section={section} key={section.id} />
          ))}
        </ul>
        <LanguageSelectorMobile mode={variant} />
      </nav>

      {isLoggedIn && (
        <nav
          className={cn(
            'flex flex-col fixed top-0 right-0 items-center w-full max-w-[320px] h-dvh duration-300 overflow-scroll no-scrollbar lg:hidden',
            isDashboardMenuOpen ? 'translate-x-0' : 'translate-x-full',
            variant === 'dark' && 'dark',
          )}
          ref={dashboardMenuRef}
        >
          <MenuDashboard
            location={location}
            toggleMobileMenu={toggleDashboardMenu}
          />
        </nav>
      )}
    </>
  );
};
