import { useRef } from 'react';

import { cn } from '@blms/ui';

import { Footer } from './footer.tsx';
import { Header } from './Header/header.tsx';
import ScrollToTopButton from './scroll-to-top-button.tsx';

interface MainLayoutProps {
  children: JSX.Element | JSX.Element[];
  variant?: 'light' | 'dark' | 'blue' | 'gray';
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
