import {
  dataResponseFor,
  errorResponseFor,
  fallbackErrorResponse,
  getBaseBackendUrl,
  noInternetAccessErrorResponse,
} from './helper.ts';
import { ScanCredentials } from '../types/scan-credentials.type.ts';

type CheckScanAuthorizationCodeRequestDto = {
  scanAuthorizationCode: string;
};

type CheckScanAuthorizationCodeResponseDto = boolean;

export async function checkScanAuthorizationCode(
  scanCredentials: ScanCredentials,
): Promise<{ data: ScanCredentials; error: null } | { data: null; error: string }> {
  try {
    if (!navigator.onLine) {
      return noInternetAccessErrorResponse();
    }

    const requestDto: CheckScanAuthorizationCodeRequestDto = {
      scanAuthorizationCode: scanCredentials.scanAuthorizationCode,
    };

    const response = await fetch(
      getBaseBackendUrl() +
        `/events/${scanCredentials.eventId}/modules/basic-ticket-store/check-scan-authorization-code`,
      {
        method: 'POST',
        body: JSON.stringify(requestDto),
      },
    );

    const json: {
      data: CheckScanAuthorizationCodeResponseDto | null;
      error: string | null;
    } = await response.json();

    if (json.error) {
      return errorResponseFor(json.error);
    } else if (!response.ok) {
      return fallbackErrorResponse();
    } else if (json.data === true) {
      return dataResponseFor(scanCredentials);
    } else if (json.data === false) {
      return errorResponseFor('Event ID of code verkeerd');
    } else {
      return fallbackErrorResponse();
    }
  } catch {
    return fallbackErrorResponse();
  }
}
