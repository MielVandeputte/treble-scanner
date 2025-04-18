import { JSX, ReactNode, use } from 'react';
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

  if (scanCredentials === undefined) {
    return null;
  }

  if (assertPresent && scanCredentials === null) {
    navigate(LOGIN_PATH, { replace: true, viewTransition: true });
    return null;
  }

  if (assertNotPresent && scanCredentials !== null) {
    navigate(SCANNER_PATH, { replace: true, viewTransition: true });
    return null;
  }

  return children;
}
