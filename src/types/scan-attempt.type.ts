export type ScanAttempt = {
  id: string;
  timestamp: Date;
  secretCode: string;
  result: ScanAttemptResult;
  ownerName: string | null;
  ownerEmailAddress: string | null;
  ticketTypeName: string | null;
};

export type ScanAttemptResult = 'SUCCESS' | 'ALREADY_SCANNED' | 'NOT_FOUND';

export function mapScanAttemptResultToString(scanAttemptResult: ScanAttemptResult): string {
  switch (scanAttemptResult) {
    case 'SUCCESS':
      return 'Geldig ticket';
    case 'ALREADY_SCANNED':
      return 'Al gescand';
    case 'NOT_FOUND':
      return 'Ongeldig ticket';
  }
}
