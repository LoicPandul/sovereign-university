import { QRCodeSVG } from 'qrcode.react';
import { Trans, useTranslation } from 'react-i18next';
import { AiOutlineCopy } from 'react-icons/ai';

import type { CheckoutData } from '@blms/types';
import { Button, cn } from '@blms/ui';

import PlanBLogo from '../assets/logo/planb_logo_horizontal_black.svg?react';

interface PaymentQrProps extends React.HTMLProps<HTMLDivElement> {
  checkoutData: CheckoutData;
  onBack?: () => void;
}

export const PaymentQr = ({ checkoutData, onBack }: PaymentQrProps) => {
  const { t } = useTranslation();
  const borderClassName =
    'border border-[rgba(115,115,115,0.1)] rounded-xl overflow-hidden';
  const unifiedPayment = checkoutData.onChainAddr
    ? `bitcoin:${checkoutData.onChainAddr?.toUpperCase()}?amount=${checkoutData.amount / 100_000_000}&label=PlanBNetwork&lightning=${checkoutData.pr}`
    : checkoutData.pr;
  const onchainAddress = checkoutData.onChainAddr
    ? `${checkoutData.onChainAddr.toUpperCase()}`
    : '';
  const lightningInvoice = checkoutData.pr;

  return (
    <>
      <div className="items-center justify-center w-full max-w-96 lg:w-96 flex flex-col gap-6 md:gap-8 max-lg:pb-6 max-lg:pt-8 mt-auto mb-4">
        <PlanBLogo className="h-auto" width={240} />
        <span className="text-center text-xs lg:text-base">
          {t('courses.payment.qr_unified')}
        </span>
        {/* Amount */}
        <div className="flex flex-col justify-center items-center">
          <span className="desktop-h7 text-center mx-auto mb-2">
            {t('words.amount')}
          </span>
          <div
            className={cn(
              'flex flex-row items-center justify-center px-4 py-3 w-fit min-w-48 mb-8 bg-white !border-newGray-4',
              borderClassName,
            )}
          >
            <span className="desktop-subtitle1 text-newBlack-3 flex-1 truncate">
              {(checkoutData.amount / 100_000_000).toLocaleString('en-US', {
                minimumFractionDigits: 8,
                maximumFractionDigits: 8,
              })}{' '}
              BTC
            </span>
            <AiOutlineCopy
              className="h-5 w-auto cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(
                  (checkoutData.amount / 100_000_000).toLocaleString('en-US', {
                    minimumFractionDigits: 8,
                    maximumFractionDigits: 8,
                  }),
                );
              }}
            />
          </div>
          <QRCodeSVG value={unifiedPayment} size={220} />
        </div>
        <div className="flex flex-col max-w-96 lg:w-96 w-full">
          {/* Unified */}
          {onchainAddress && (
            <>
              <span className="desktop-h7 text-center mx-auto mb-2">
                {t('words.unified')}
              </span>
              <div
                className={cn(
                  'flex flex-row items-center justify-center px-4 py-3 w-full mb-8 bg-commentTextBackground',
                  borderClassName,
                )}
              >
                <span className="desktop-subtitle1 text-newGray-1 flex-1 truncate">
                  {unifiedPayment}
                </span>
                <AiOutlineCopy
                  className="h-5 w-auto cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(unifiedPayment);
                  }}
                />
              </div>
            </>
          )}
          {/* On-Chain */}
          {onchainAddress && (
            <>
              <span className="desktop-h7 text-center mx-auto mb-2">
                {t('words.onChainAddress')}
              </span>
              <div
                className={cn(
                  'flex flex-row items-center justify-center px-4 py-3 w-full mb-8 bg-commentTextBackground',
                  borderClassName,
                )}
              >
                <span className="desktop-subtitle1 text-newGray-1 flex-1 truncate">
                  {onchainAddress}
                </span>
                <AiOutlineCopy
                  className="h-5 w-auto cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(onchainAddress);
                  }}
                />
              </div>
            </>
          )}
          {/* Lightning */}
          <span className="desktop-h7 text-center mx-auto mb-2">
            {t('words.lightningInvoice')}
          </span>
          <div
            className={cn(
              'flex flex-row items-center justify-center px-4 py-3 w-full bg-commentTextBackground',
              borderClassName,
            )}
          >
            <span className="desktop-subtitle1 text-newGray-1 flex-1 truncate">
              {lightningInvoice}
            </span>
            <AiOutlineCopy
              className="h-5 w-auto cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(lightningInvoice);
              }}
            />
          </div>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
      </div>
      <div className="text-center uppercase md:text-xs justify-self-end mt-auto  mb-2">
        <div className="text-[10px] md:text-xs">
          <Trans i18nKey="payment.terms">
            <a
              className="underline underline-offset-2 hover:text-darkOrange-5 hover:no-underline"
              href="/terms-and-conditions"
              target="_blank"
              rel="noreferrer"
            >
              Payment terms
            </a>
          </Trans>
        </div>
      </div>
    </>
  );
};
