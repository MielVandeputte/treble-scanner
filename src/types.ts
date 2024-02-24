export type TicketScanAttempt = {
    result: string;
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