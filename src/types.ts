export type TicketScanAttemptResult = 'success' | 'alreadyScanned' | 'notFound';

export type TicketScanAttempt = {
    result: TicketScanAttemptResult;
    timestamp: Date;
    secretCode: string;
    ownerName: string;
    ownerEmail: string;
    ticketTypeName: string;
};

export type ScannerCredentials = {
    eventId: string;
    scanAuthorizationCode: string;
};
