import { JSX, use, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../components/button.tsx';
import { Input } from '../components/input.tsx';
import { ScanCredentialsContext } from '../contexts/scan-credentials-context.tsx';
import { checkScanAuthorizationCode } from '../services/check-scan-authorization-code.ts';
import { ScanCredentials } from '../types/scan-credentials.ts';

import '@fontsource/proza-libre/600.css';

type FormType = ScanCredentials;

export function Login(): JSX.Element {
  const setScanCredentials = use(ScanCredentialsContext).setScanCredentials;

  const {
    register,
    formState: { disabled, errors, isSubmitting: submitting },
    handleSubmit,
  } = useForm<FormType>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onFormSubmit(formData: FormType): Promise<void> {
    setErrorMessage(null);

    const { data, error } = await checkScanAuthorizationCode(formData);

    if (data) {
      setScanCredentials(data);
    } else if (error) {
      setErrorMessage(error);
    }
  }

  return (
    <main className="flex justify-center">
      <form
        id="login-form"
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex h-svh w-full max-w-md flex-col items-center justify-center gap-5 px-10 py-5"
        aria-describedby={errorMessage ? 'error-message' : undefined}
      >
        <h1 className="brand-font text-center text-4xl text-zinc-200 select-none">treble</h1>

        <p className="text-justify font-semibold select-none">
          Voer het event ID en de code in om tickets te beginnen scannen. Beide zijn te vinden in het dashboard op
          treble-events.be.
        </p>

        <div className="flex w-full flex-col items-center gap-4">
          <Input
            id="event-id-input"
            {...register('eventId', { required: true })}
            placeholder="Event ID"
            autoComplete="off"
            invalid={!!errors.eventId}
            srLabel="Event ID"
            aria-required
          />

          <Input
            id="code-input"
            {...register('scanAuthorizationCode', { required: true })}
            placeholder="Code"
            autoComplete="off"
            invalid={!!errors.scanAuthorizationCode}
            srLabel="Code"
            aria-required
          />
        </div>

        <Button type="submit" color="brand" horizontalPadding loading={submitting} disabled={disabled}>
          Start
        </Button>

        {errorMessage ? (
          <p id="error-message" className="font-semibold text-rose-900 select-none" role="alert" aria-live="assertive">
            {errorMessage}
          </p>
        ) : null}
      </form>
    </main>
  );
}
