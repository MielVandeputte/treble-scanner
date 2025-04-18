export type CheckScanAuthorizationCodeRequestDto = {
  scanAuthorizationCode: string;
};

export type CheckScanAuthorizationCodeResponseDto = boolean;

export type ScanTicketRequestDto = {
  secretCode: string;
  scanAuthorizationCode: string;
};

export type ScanTicketResponseDto = {
  result: 'SUCCESS' | 'ALREADY_SCANNED' | 'NOT_FOUND';
  ownerName: string | null;
  ownerEmail: string | null;
  ticketTypeName: string | null;
};
