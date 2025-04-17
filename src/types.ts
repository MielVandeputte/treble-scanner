export type TicketScanAttemptResult = 'SUCCESS' | 'ALREADY_SCANNED' | 'NOT_FOUND';

export type TicketScanAttempt = {
  id: string;
  result: TicketScanAttemptResult;
  timestamp: Date;
  secretCode: string;
  ownerName?: string;
  ownerEmail?: string;
  ticketTypeName?: string;
};

export type ScannerCredentials = {
  eventId: string;
  scanAuthorizationCode: string;
};
