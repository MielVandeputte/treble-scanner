export type TicketScanAttemptResult = 'success' | 'alreadyScanned' | 'noTicket';

export type TicketScanAttempt = {
    result: TicketScanAttemptResult;
    timestamp: Date;

    secretCode: string;

    ownerName: string;
    ownerEmail: string;

    ticketTypeId: number;
    ticketTypeName: string;
};

export type ScannerCredentials = {
    eventId: string;
    scanAuthorizationCode: string;
};