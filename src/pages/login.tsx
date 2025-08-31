import { JSX, use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import { Button } from '../components/button.tsx';
import { Input } from '../components/input.tsx';
import { ScanCredentialsContext } from '../contexts/scan-credentials-context.tsx';
import { checkScanAuthorizationCode } from '../services/check-scan-authorization-code.ts';
import { ScanCredentials } from '../types/scan-credentials.ts';

import '@fontsource/proza-libre/600.css';

type FormType = ScanCredentials;

const EVENT_ID_SEARCH_PARAM = 'eventId';

export function Login(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const setScanCredentials = use(ScanCredentialsContext).setScanCredentials;

  const {
    register,
    setValue,
    formState: { disabled, errors, isSubmitting: submitting },
    handleSubmit,
  } = useForm<FormType>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.has(EVENT_ID_SEARCH_PARAM)) {
      setValue('eventId', searchParams.get(EVENT_ID_SEARCH_PARAM)!);
      searchParams.delete(EVENT_ID_SEARCH_PARAM);
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, setValue]);

  async function onFormSubmit(formData: FormType): Promise<void> {
    setErrorMessage(null);

    const { data, error } = await checkScanAuthorizationCode(formData);

    if (error === null) {
      setScanCredentials(data);
    } else {
      setErrorMessage(error);
    }
  }

  return (
    <main className="flex justify-center">
      <form
        id="login-form"
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex h-svh w-full max-w-md flex-col items-center justify-center gap-5 px-10"
        aria-errormessage={errorMessage ? 'error-message' : undefined}
      >
        <h1 className="brand-font text-center text-4xl text-zinc-200 select-none">treble</h1>

        <p className="font-semibold select-none">
          De inloggegevens zijn te vinden in het dashboard op treble-events.be.
        </p>

        <div className="flex w-full flex-col items-center gap-4">
          <Input
            id="event-id-input"
            {...register('eventId', { required: true })}
            label="Event ID"
            autoComplete="off"
            autoFocus
            invalid={!!errors.eventId}
            aria-required
          />

          <Input
            id="code-input"
            {...register('scanAuthorizationCode', { required: true })}
            label="Code"
            autoComplete="off"
            invalid={!!errors.scanAuthorizationCode}
            aria-required
          />
        </div>

        <Button type="submit" loading={submitting} disabled={disabled}>
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
