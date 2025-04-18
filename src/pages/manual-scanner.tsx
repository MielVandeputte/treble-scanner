import { JSX, use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/button.tsx';
import { Footer } from '../components/footer.tsx';
import { Header } from '../components/header.tsx';
import { BackIcon } from '../components/icons.tsx';
import { Input } from '../components/input.tsx';
import { ScanCredentialsContext } from '../contexts/scan-credentials-context.tsx';
import { ScanHistoryContext } from '../contexts/scan-history-context.tsx';
import { SCANNER_PATH } from '../main.tsx';
import { scanTicket } from '../services/scan-ticket.ts';
import { mapScanAttemptResultToString, ScanAttempt } from '../types/scan-attempt.ts';

type FormType = { secretCode: string };

export function ManualScanner(): JSX.Element {
  const navigate = useNavigate();
  const scanCredentials = use(ScanCredentialsContext).scanCredentials;
  const addScanAttempt = use(ScanHistoryContext).addScanAttempt;

  const {
    register,
    formState: { disabled, errors, isSubmitting },
    handleSubmit,
  } = useForm<FormType>();

  const [lastScanAttemptState, setLastScanAttemptState] = useState<ScanAttempt | null>(null);
  const [errorMessageState, setErrorMessageState] = useState<string | null>(null);

  async function onFormSubmit(formData: FormType): Promise<void> {
    setLastScanAttemptState(null);
    setErrorMessageState(null);

    const { data, error } = await scanTicket(formData.secretCode, scanCredentials!);

    if (data) {
      setLastScanAttemptState(data);
      addScanAttempt(data);
    } else if (error) {
      setErrorMessageState(error);
    }
  }

  return (
    <div className="grid h-dvh w-screen grid-rows-[auto_1fr_auto]">
      <Header title="Manueel scannen" />

      <main className="flex justify-center">
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-5 px-10 py-5">
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex w-full flex-col items-center gap-4">
            <Input
              {...register('secretCode', { required: true })}
              placeholder="Geheime code"
              autoComplete="off"
              invalid={!!errors.secretCode}
            />

            <Button type="submit" color="brand" horizontalPadding loading={isSubmitting} disabled={disabled}>
              Scan
            </Button>
          </form>

          <div className="min-h-32">
            {lastScanAttemptState ? (
              <div className="flex flex-col gap-2 text-center font-semibold text-zinc-400">
                <span>
                  {mapScanAttemptResultToString(lastScanAttemptState.result)}
                  {lastScanAttemptState.ticketTypeName ? <br /> : null}
                  {lastScanAttemptState.ticketTypeName ?? null}
                </span>

                {lastScanAttemptState.ownerName || lastScanAttemptState.ownerEmail ? (
                  <span>
                    {lastScanAttemptState.ownerName ?? null}
                    {lastScanAttemptState.ownerName && lastScanAttemptState.ownerEmail ? <br /> : null}
                    {lastScanAttemptState.ownerEmail ?? null}
                  </span>
                ) : null}
              </div>
            ) : null}

            {errorMessageState ? (
              <span className="font-semibold text-rose-900 select-none">{errorMessageState}</span>
            ) : null}
          </div>
        </div>
      </main>

      <Footer cols={1}>
        <Button onClick={() => navigate(SCANNER_PATH, { viewTransition: true })}>
          <BackIcon />
        </Button>
      </Footer>
    </div>
  );
}
