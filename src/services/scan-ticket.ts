import {
  dataResponseFor,
  errorResponseFor,
  fallbackErrorResponse,
  getBaseBackendUrl,
  noInternetAccessErrorResponse,
} from './helper.ts';
import { ScanTicketRequestDto, ScanTicketResponseDto } from '../types/dtos.ts';
import { ScanAttempt } from '../types/scan-attempt.ts';
import { ScanCredentials } from '../types/scan-credentials.ts';

export async function scanTicket(
  secretCode: string,
  scanCredentials: ScanCredentials,
): Promise<{ data: ScanAttempt | null; error: string | null }> {
  try {
    if (!navigator.onLine) {
      return noInternetAccessErrorResponse();
    }

    const requestDto: ScanTicketRequestDto = {
      secretCode,
      scanAuthorizationCode: scanCredentials.scanAuthorizationCode,
    };

    const query = await fetch(
      getBaseBackendUrl() + `/events/${scanCredentials.eventId}/modules/basic-ticket-store/scan-ticket`,
      {
        method: 'POST',
        body: JSON.stringify(requestDto),
      },
    );

    const json = (await query.json()) as { data: ScanTicketResponseDto | null; error: string | null };

    if (json.data) {
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
      return json.error ? errorResponseFor(json.error) : fallbackErrorResponse();
    }
  } catch {
    return fallbackErrorResponse();
  }
}
