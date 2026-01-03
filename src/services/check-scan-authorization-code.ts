import {
  dataResponseFor,
  errorResponseFor,
  FALLBACK_ERROR_RESPONSE,
  BASE_BACKEND_URL,
  NO_INTERNET_ACCESS_ERROR_RESPONSE,
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
      return NO_INTERNET_ACCESS_ERROR_RESPONSE;
    }

    const requestDto: CheckScanAuthorizationCodeRequestDto = {
      scanAuthorizationCode: scanCredentials.scanAuthorizationCode,
    };

    const response = await fetch(
      BASE_BACKEND_URL + `/events/${scanCredentials.eventId}/modules/basic-ticket-store/check-scan-authorization-code`,
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
      return FALLBACK_ERROR_RESPONSE;
    } else if (json.data === true) {
      return dataResponseFor(scanCredentials);
    } else if (json.data === false) {
      return errorResponseFor('Event ID of code verkeerd');
    } else {
      return FALLBACK_ERROR_RESPONSE;
    }
  } catch {
    return FALLBACK_ERROR_RESPONSE;
  }
}
