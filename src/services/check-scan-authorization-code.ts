import {
  dataResponseFor,
  errorResponseFor,
  fallbackErrorResponse,
  getBaseBackendUrl,
  noInternetAccessErrorResponse,
} from './helper.ts';
import { CheckScanAuthorizationCodeRequestDto, CheckScanAuthorizationCodeResponseDto } from '../types/dtos.ts';
import { ScanCredentials } from '../types/scan-credentials.ts';

export async function checkScanAuthorizationCode(
  scanCredentials: ScanCredentials,
): Promise<{ data: ScanCredentials | null; error: string | null }> {
  try {
    if (!navigator.onLine) {
      return noInternetAccessErrorResponse();
    }

    const requestDto: CheckScanAuthorizationCodeRequestDto = {
      scanAuthorizationCode: scanCredentials.scanAuthorizationCode,
    };

    const query = await fetch(
      getBaseBackendUrl() +
        `/events/${scanCredentials.eventId}/modules/basic-ticket-store/check-scan-authorization-code`,
      {
        method: 'POST',
        body: JSON.stringify(requestDto),
      },
    );

    const json = (await query.json()) as { data: CheckScanAuthorizationCodeResponseDto | null; error: string | null };

    if (json.data === true) {
      return dataResponseFor(scanCredentials);
    } else {
      if (json.data === false) {
        return errorResponseFor('Event ID of code verkeerd');
      } else if (json.error) {
        return errorResponseFor(json.error);
      } else {
        return fallbackErrorResponse();
      }
    }
  } catch {
    return fallbackErrorResponse();
  }
}
