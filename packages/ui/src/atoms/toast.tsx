import { cva } from 'class-variance-authority';
import type { MouseEventHandler } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import type { IconType } from 'react-icons/lib';
import { toast } from 'react-toastify';

const toastVariants = cva('md:!w-[299px]', {
  variants: {
    mode: {
      light: '',
      dark: 'dark',
    },
    color: {
      primary: '!bg-darkOrange-2 dark:!bg-darkOrange-8',
      secondary: '!bg-darkOrange-0 dark:!bg-darkOrange-10',
      warning: '!bg-red-1 dark:!bg-red-7',
      success: '!bg-brightGreen-1 dark:!bg-brightGreen-9',
      neutral: '!bg-newBlack-3 dark:!bg-newGray-6',
    },
  },
  defaultVariants: {
    mode: 'light',
    color: 'primary',
  },
});

const textVariants = cva('body-medium-12px', {
  variants: {
    mode: {
      light: '!text-newBlack-1',
      dark: '!text-white',
    },
  },
  defaultVariants: {
    mode: 'light',
  },
});

const iconVariants = cva('shrink-0', {
  variants: {
    mode: {
      light: '',
      dark: 'dark',
    },
    color: {
      primary: '!text-darkOrange-5',
      secondary: '!text-darkOrange-3 dark:!text-darkOrange-5',
      warning: '!text-red-5 dark:!text-red-3',
      success: '!text-brightGreen-4',
      neutral: '!text-newGray-3 dark:!text-newGray-4',
    },
  },
  defaultVariants: {
    mode: 'light',
    color: 'primary',
  },
});

const progressBarVariants = cva('', {
  variants: {
    mode: {
      light: '',
      dark: 'dark',
    },
    color: {
      primary: '!bg-darkOrange-4 dark:!bg-darkOrange-6',
      secondary: '!bg-darkOrange-2 dark:!bg-darkOrange-7',
      warning: '!bg-red-2 dark:!bg-red-4',
      success: '!bg-brightGreen-3 dark:!bg-brightGreen-5',
      neutral: '!bg-newGray-4 dark:!bg-newGray-3',
    },
  },
  defaultVariants: {
    mode: 'light',
    color: 'primary',
  },
});

const toastCloseButtonVariants = cva('shrink-0', {
  variants: {
    mode: {
      light: 'hover:!brightness-90',
      dark: 'dark hover:!brightness-110',
    },
    color: {
      primary: '!text-darkOrange-6',
      secondary: '!text-darkOrange-4 dark:!text-darkOrange-6',
      warning: '!text-red-4',
      success: '!text-brightGreen-5 dark:!text-brightGreen-6',
      neutral: '!text-newGray-3 dark:!text-newGray-2',
    },
  },
  defaultVariants: {
    mode: 'light',
    color: 'primary',
  },
});

interface ToastProps {
  mode?: 'light' | 'dark';
  color?: 'primary' | 'secondary' | 'warning' | 'success' | 'neutral';
}

export const customToast = (
  message: string,
  options: {
    mode?: ToastProps['mode'];
    color?: ToastProps['color'];
    icon?: IconType;
    imgSrc?: string;
    closeButton?: boolean;
    closeOnClick?: boolean;
    onClick?: () => void;
    time?: number;
  },
) => {
  const { closeOnClick = true } = options;

  return toast(message, {
    autoClose: options.time || 5000,
    className: toastVariants({
      mode: options.mode,
      color: options.color,
    }),
    bodyClassName: textVariants({
      mode: options.mode,
    }),
    progressClassName: progressBarVariants({
      mode: options.mode,
      color: options.color,
    }),
    icon: options.imgSrc
      ? () => (
          <img src={options.imgSrc} alt={message} className="shrink-0 size-8" />
        )
      : options.icon && (
          <ToastIconWithClasses
            icon={options.icon}
            mode={options.mode}
            color={options.color}
          />
        ),
    closeButton: options.onClick
      ? false
      : options.closeButton
        ? ({
            closeToast,
          }: {
            closeToast: MouseEventHandler<HTMLButtonElement>;
          }) => (
            <ToastCloseButton
              closeToast={closeToast}
              mode={options.mode}
              color={options.color}
            />
          )
        : false,
    onClick: options.onClick,
    closeOnClick: closeOnClick,
  });
};

export const ToastCloseButton = ({
  closeToast,
  mode,
  color,
}: {
  closeToast: MouseEventHandler<HTMLButtonElement>;
  mode?: ToastProps['mode'];
  color?: ToastProps['color'];
}) => (
  <button
    onClick={closeToast}
    aria-label="Close toast"
    className="shrink-0 self-start"
    tabIndex={0}
  >
    <IoCloseOutline
      size={24}
      className={toastCloseButtonVariants({ mode, color })}
    />
  </button>
);

export const ToastIconWithClasses = ({
  icon: Icon,
  mode,
  color,
}: {
  icon: IconType;
  mode?: ToastProps['mode'];
  color?: ToastProps['color'];
}) => {
  return <Icon size={28} className={iconVariants({ mode, color })} />;
};
