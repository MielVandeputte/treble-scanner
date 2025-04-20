import { JSX, ReactNode, use, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ScanCredentialsContext } from '../contexts/scan-credentials-context.tsx';
import { LOGIN_PATH, SCANNER_PATH } from '../main.tsx';

export function CredentialsFilter({
  assertPresent = false,
  assertNotPresent = false,
  children,
}: {
  assertPresent?: boolean;
  assertNotPresent?: boolean;
  children: ReactNode;
}): JSX.Element | ReactNode | null {
  const navigate = useNavigate();
  const scanCredentials = use(ScanCredentialsContext).scanCredentials;

  useEffect(() => {
    if (assertPresent && scanCredentials === null) {
      navigate(LOGIN_PATH, { replace: true, viewTransition: true });
    } else if (assertNotPresent && scanCredentials !== null) {
      navigate(SCANNER_PATH, { replace: true, viewTransition: true });
    }
  }, [navigate, scanCredentials, assertPresent, assertNotPresent]);

  if (scanCredentials === undefined) {
    return null;
  }

  if (assertPresent && scanCredentials === null) {
    return null;
  }

  if (assertNotPresent && scanCredentials !== null) {
    return null;
  }

  return children;
}
