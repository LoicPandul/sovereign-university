import { t } from 'i18next';
import { useEffect, useRef } from 'react';

import { cn, customToast } from '@blms/ui';

import SignInIconLight from '#src/assets/icons/profile_log_in_light.svg';

import { Header } from './Header/header.tsx';
import { Footer } from './footer.tsx';
import ScrollToTopButton from './scroll-to-top-button.tsx';

interface MainLayoutProps {
  children: JSX.Element | JSX.Element[];
  variant?: 'light' | 'dark' | 'gray';
  showFooter?: boolean;
  headerVariant?: 'light' | 'dark';
  footerVariant?: 'light' | 'dark';
}

export const MainLayout = ({
  children,
  variant = 'dark',
  showFooter = true,
  footerVariant,
  headerVariant,
}: MainLayoutProps) => {
  const box = useRef<HTMLDivElement | null>(null);

  const bgColorClasses = {
    light: 'bg-white',
    dark: 'bg-black',
    blue: 'bg-blue-200',
    gray: 'bg-newGray-6',
  };

  // using session storage to check if user just registered and show toast
  useEffect(() => {
    const hasJustRegistered = sessionStorage.getItem('hasJustRegistered');

    if (hasJustRegistered) {
      customToast(t('auth.dashboardUnlocked'), {
        mode: variant === 'dark' ? 'dark' : 'light',
        color: 'primary',
        time: 5000,
        closeButton: true,
        imgSrc: SignInIconLight,
      });

      sessionStorage.removeItem('hasJustRegistered');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        'text-white flex flex-col min-h-dvh',
        bgColorClasses[variant],
      )}
      ref={box}
    >
      {/* Header */}
      <Header variant={headerVariant} />

      {/* Content */}
      <main className="flex grow flex-col">{children}</main>

      {/* Footer */}
      {showFooter && <Footer variant={footerVariant} />}

      <ScrollToTopButton />
    </div>
  );
};
