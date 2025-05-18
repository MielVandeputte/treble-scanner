import { JSX, use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/button.tsx';
import { Footer } from '../components/footer.tsx';
import { Header } from '../components/header.tsx';
import { ReturnIcon } from '../components/icons.tsx';
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
    formState: { disabled, errors, isSubmitting: submitting },
    handleSubmit,
  } = useForm<FormType>();

  const [lastScanAttempt, setLastScanAttempt] = useState<ScanAttempt | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onFormSubmit(formData: FormType): Promise<void> {
    setLastScanAttempt(null);
    setErrorMessage(null);

    const { data, error } = await scanTicket(formData.secretCode, scanCredentials!);

    if (data) {
      setLastScanAttempt(data);
      addScanAttempt(data);
    } else if (error) {
      setErrorMessage(error);
    }
  }

  return (
    <div className="grid h-svh grid-rows-[auto_1fr_auto]">
      <Header title="Manueel scannen" />

      <main className="flex justify-center">
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-5 px-10 py-5">
          <form
            id="manual-scan-form"
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex w-full flex-col items-center gap-4"
            aria-describedby={errorMessage ? 'error-message' : undefined}
          >
            <Input
              id="secret-code-input"
              {...register('secretCode', { required: true })}
              placeholder="Geheime code"
              autoComplete="off"
              invalid={!!errors.secretCode}
              srLabel="Geheime code"
              aria-required
            />

            <Button type="submit" color="brand" horizontalPadding loading={submitting} disabled={disabled}>
              Scan
            </Button>
          </form>

          {lastScanAttempt ? (
            <div className="flex flex-col gap-2 text-center font-semibold" role="status" aria-live="polite">
              <p>
                {mapScanAttemptResultToString(lastScanAttempt.result)}
                {lastScanAttempt.ticketTypeName ? <br /> : null}
                {lastScanAttempt.ticketTypeName ?? null}
              </p>

              {lastScanAttempt.ownerName || lastScanAttempt.ownerEmail ? (
                <p>
                  {lastScanAttempt.ownerName ?? null}
                  {lastScanAttempt.ownerName && lastScanAttempt.ownerEmail ? <br /> : null}
                  {lastScanAttempt.ownerEmail ?? null}
                </p>
              ) : null}
            </div>
          ) : null}

          {errorMessage ? (
            <p
              id="error-message"
              className="font-semibold text-rose-900 select-none"
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      </main>

      <Footer columns={1}>
        <Button
          type="button"
          onClick={() => navigate(SCANNER_PATH, { viewTransition: true })}
          aria-label="Terug naar scanner"
        >
          <ReturnIcon aria-hidden />
        </Button>
      </Footer>
    </div>
  );
}
