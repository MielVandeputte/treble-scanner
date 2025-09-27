import {
  dataResponseFor,
  errorResponseFor,
  fallbackErrorResponse,
  getBaseBackendUrl,
  noInternetAccessErrorResponse,
} from './helper.ts';
import { ScanAttempt } from '../types/scan-attempt.type.ts';
import { ScanCredentials } from '../types/scan-credentials.type.ts';

type ScanTicketRequestDto = {
  secretCode: string;
  scanAuthorizationCode: string;
};

type ScanTicketResponseDto = {
  result: 'SUCCESS' | 'ALREADY_SCANNED' | 'NOT_FOUND';
  ownerName: string | null;
  ownerEmail: string | null;
  ticketTypeName: string | null;
};

export async function scanTicket(
  secretCode: string,
  scanCredentials: ScanCredentials,
): Promise<{ data: ScanAttempt; error: null } | { data: null; error: string }> {
  try {
    if (!navigator.onLine) {
      return noInternetAccessErrorResponse();
    }

    const requestDto: ScanTicketRequestDto = {
      secretCode,
      scanAuthorizationCode: scanCredentials.scanAuthorizationCode,
    };

    const response = await fetch(
      getBaseBackendUrl() + `/events/${scanCredentials.eventId}/modules/basic-ticket-store/scan-ticket`,
      {
        method: 'POST',
        body: JSON.stringify(requestDto),
      },
    );

    const json: { data: ScanTicketResponseDto | null; error: string | null } = await response.json();

    if (json.error) {
      return errorResponseFor(json.error);
    } else if (!response.ok) {
      return fallbackErrorResponse();
    } else if (json.data) {
      return dataResponseFor({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        secretCode,
        result: json.data.result,
        ownerName: json.data.ownerName,
        ownerEmail: json.data.ownerEmail,
        ticketTypeName: json.data.ticketTypeName,
      });
    } else {
      return fallbackErrorResponse();
    }
  } catch {
    return fallbackErrorResponse();
  }
}
