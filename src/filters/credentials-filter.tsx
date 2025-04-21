import { JSX, ReactNode, use } from 'react';
import { Navigate } from 'react-router-dom';

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
  const scanCredentials = use(ScanCredentialsContext).scanCredentials;

  if (scanCredentials === undefined) {
    return null;
  }

  if (assertPresent && scanCredentials === null) {
    return <Navigate to={LOGIN_PATH} />;
  }

  if (assertNotPresent && scanCredentials !== null) {
    return <Navigate to={SCANNER_PATH} />;
  }

  return children;
}
